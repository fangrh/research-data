use pyo3::conversion::IntoPyObjectExt;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList};
use rusqlite::{Connection, OpenFlags};
use serde_json::Value;

/// Convert a decoded JSON value into the matching Python object.
fn json_to_py(py: Python, value: &Value) -> PyResult<PyObject> {
    Ok(match value {
        Value::Null => py.None(),
        Value::Bool(b) => {
            let flag = *b;
            flag.into_py_any(py)?
        }
        Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                i.into_py_any(py)?
            } else {
                n.as_f64().unwrap_or(f64::NAN).into_py_any(py)?
            }
        }
        Value::String(s) => s.into_py_any(py)?,
        Value::Array(items) => {
            let list = PyList::empty(py);
            for item in items {
                list.append(json_to_py(py, item)?)?;
            }
            list.into_py_any(py)?
        }
        Value::Object(map) => {
            let dict = PyDict::new(py);
            for (k, v) in map {
                dict.set_item(k, json_to_py(py, v)?)?;
            }
            dict.into_py_any(py)?
        }
    })
}

fn decode_or(py: Python, text: &str, fallback: &str) -> PyResult<PyObject> {
    match serde_json::from_str::<Value>(text) {
        Ok(value) => json_to_py(py, &value),
        Err(_) => json_to_py(py, &serde_json::from_str::<Value>(fallback).unwrap()),
    }
}

/// Read run summaries from the catalog SQLite index without touching manifests.
/// Mirrors the pure-Python reference implementation in catalog.py.
#[pyfunction]
fn load_run_summaries(py: Python, db_path: String) -> PyResult<Vec<PyObject>> {
    let conn = Connection::open_with_flags(&db_path, OpenFlags::SQLITE_OPEN_READ_ONLY)
        .map_err(|e| PyRuntimeError::new_err(format!("cannot open {}: {}", db_path, e)))?;
    let mut stmt = conn
        .prepare(
            "SELECT run_id, title, project, sample, kind, execution_status, \
             created_at, updated_at, tags, categories, parameters, description FROM runs",
        )
        .map_err(|e| PyRuntimeError::new_err(format!("prepare failed: {}", e)))?;
    let mut rows = stmt.query([]).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
    let mut out = Vec::new();
    while let Some(row) = rows.next().map_err(|e| PyRuntimeError::new_err(e.to_string()))? {
        let dict = PyDict::new(py);
        let strings: [(&str, usize); 8] = [
            ("run_id", 0),
            ("title", 1),
            ("project", 2),
            ("sample", 3),
            ("kind", 4),
            ("execution_status", 5),
            ("created_at", 6),
            ("updated_at", 7),
        ];
        for (key, idx) in strings {
            let value: Option<String> = row
                .get(idx)
                .map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
            dict.set_item(key, value)?;
        }
        let tags: Option<String> = row.get(8).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        dict.set_item(
            "tags",
            decode_or(py, tags.as_deref().unwrap_or("[]"), "[]")?,
        )?;
        let categories: Option<String> =
            row.get(9).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        dict.set_item(
            "categories",
            decode_or(py, categories.as_deref().unwrap_or("{}"), "{}")?,
        )?;
        let parameters: Option<String> =
            row.get(10).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        dict.set_item(
            "parameters",
            decode_or(py, parameters.as_deref().unwrap_or("{}"), "{}")?,
        )?;
        let description: Option<String> =
            row.get(11).map_err(|e| PyRuntimeError::new_err(e.to_string()))?;
        dict.set_item(
            "description",
            description.into_pyobject(py)?.into_any(),
        )?;
        out.push(dict.into_py_any(py)?);
    }
    Ok(out)
}

#[pymodule]
fn research_data_rspeed(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(load_run_summaries, m)?)?;
    Ok(())
}
