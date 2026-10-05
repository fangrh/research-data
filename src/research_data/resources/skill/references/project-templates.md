# Project templates

Use `research-data project init --project-dir SOURCE_ROOT` once; it refuses to
overwrite existing configuration. Edit `research-data.project.json`, with
schema `research-data.project.v1`, `profiles` and `plots` named dictionaries.
Run `research-data project check --project-dir SOURCE_ROOT`, then use
`import/run --profile project:NAME --project-dir SOURCE_ROOT` and
`plot RUN_ID --recipe project:NAME --project-dir SOURCE_ROOT --output figure.svg`.

Profile fields: x, rename, units, descriptions, coordinates (variable to ordered
dimension-name lists), variables, format, qcodes_guid/qcodes_run_id.
Recipe fields: kind=line/scatter/compare/complex/heatmap, x/y/z/y_axis,
component=real/imag/abs/phase, slices (integer indices), theme, title,
x_label/y_label, log_x/log_y, width/height, style and safe layout.

For custom structures use kind=panels, columns=1..4, panels=[ordinary recipes].
Maximum 12 panels, no nesting. Each panel may select input datasets with
dataset_indices=[0,1]. Axis units and order are retained; conversion and
interpolation require an explicit scientific preprocessing step.

Style fields: font_family/font_size/title_size/axis_title_size/tick_size/
legend_size, line_width/marker_size/line_dash, show_grid/show_legend,
legend_position=bottom/right/top, colors (list), colorscale.
Layouts support backgrounds, font, margin, title, legend, width/height,
annotations/shapes (outer figure or single plot only).

Resolved definitions include _project_template containing exact source text,
SHA-256 and Git identity. Preserve it when registering derived figures; the
generated data's source identity remains on the input run. Never execute
project source just to browse or style data. Special scientific rendering
can use the project's existing Julia/Python script, captured through run.
