# Integration API

```python
from research_data import Catalog

catalog = Catalog("DATA_CATALOG")
with catalog.run(
    title="Temperature sweep", project="PROJECT", kind="simulation",
    description="Purpose and model boundary", repo="SOURCE_ROOT",
    entrypoint="scripts/run.jl", source_paths=["scripts", "src", "Project.toml", "Manifest.toml"],
    parameters={"temperature_K": 2, "grid": 384},
    categories={"domain": "transport", "system": "graphene"}, tags=["sweep"],
) as run:
    # Execute the existing solver, writing a data file.
    run.add_artifact("result.csv", description="Current versus applied voltage",
                     profile={"x": "voltage", "units": {"voltage": "V", "current": "A"},
                              "descriptions": {"current": "Measured or modeled current"}})
```

`start_run`/`register`/`finish` are the corresponding CLI commands for languages without the Python API. `run -- COMMAND` captures source before launching any stack, supplies an output directory and retains failures.

Useful CLI operations:

```text
research-data search KEYWORDS --filter project=PROJECT
research-data show RUN_ID
research-data profile transport PROFILE_JSON_FILE
research-data register RUN_ID DATA_FILE --profile transport
research-data plot RUN_ID_1 RUN_ID_2 --recipe RECIPE_NAME --output comparison.svg
research-data browse
research-data check RUN_ID
```

Import profile fields include x, rename, units, descriptions, coordinates (variable to ordered coordinate-name list), variables, qcodes_guid/qcodes_run_id, and format. HDF5 axes require declared coordinates or self-description. No interpolation, unit conversion or sorting is implicit.

Plot recipe: kind=line/scatter/compare/heatmap/complex, x, y (name or list), z and y_axis for heatmaps, component=real/imag/abs/phase, slices (dimension to integer index), theme, title, labels and figure dimensions. Reuse means the mapped variables/dimensions must remain compatible; fail with an actionable mapping error when they do not.
