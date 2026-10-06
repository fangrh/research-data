import json

from research_data.cli import main, parser
from research_data.help import command_catalog, render_help, workflow_guide


def test_catalog_derives_real_parser_options_without_mutating_parser():
    p = parser()
    before = [a.dest for a in p._actions]
    catalog = command_catalog(p, "run")
    after = [a.dest for a in p._actions]
    assert before == after
    assert "run" in catalog["commands"]
    run = catalog["commands"]["run"]
    title = next(item for item in run["options"] if item["dest"] == "title")
    assert title["required"] is True
    assert "--profile" in {flag for item in run["options"] for flag in item.get("flags", [])}


def test_machine_catalog_is_json_serializable_and_agent_is_complete():
    catalog = command_catalog(parser(), "agent")
    encoded = json.dumps(catalog)
    assert "run" in catalog["commands"]
    assert "generate" in catalog["workflows"]
    assert "RESEARCH_DATA_OUTPUT" in catalog["environment"]
    assert "research-data.command-catalog.v1" in encoded


def test_readable_help_matches_parser_and_has_contextual_example():
    p = parser()
    rendered = render_help(p, "plot")
    assert "--recipe" in rendered
    assert "recipe.json" in rendered
    assert rendered.startswith("usage:")


def test_workflow_guide_supports_human_and_machine_forms():
    readable = workflow_guide("agent")
    machine = workflow_guide("agent", machine=True)
    assert "help --json" in readable
    assert machine["workflows"]["agent"]["steps"]
    assert machine["workflows"]["agent"]["example"] == "research-data guide agent --json"


def test_plot_and_proof_guidance_states_recipe_shape_and_empty_draft_route():
    plot = workflow_guide("plot", machine=True)["workflows"]["plot"]
    proof = workflow_guide("proof", machine=True)["workflows"]["proof"]
    assert '"style":{"line_width":2,"font_size":14}' in "".join(plot["notes"])
    assert "JSON null" in proof["decision"]


def test_discovery_and_errors_do_not_mutate_catalog(tmp_path, monkeypatch, capsys):
    root = tmp_path / "absent catalog"
    monkeypatch.setenv("RESEARCH_DATA_CATALOG", str(root))
    assert main([]) == 0
    assert "Command groups" in capsys.readouterr().out
    assert main(["help", "run", "--json"]) == 0
    assert json.loads(capsys.readouterr().out)["commands"]["run"]["example"]
    assert main(["guide", "agent", "--json"]) == 0
    assert "agent" in json.loads(capsys.readouterr().out)["workflows"]
    for args in (["help", "typo"], ["help", "typo", "--json"], ["guide", "typo"]):
        assert main(args) == 2
        assert "Unknown" in json.loads(capsys.readouterr().err)["error"]
    assert not root.exists()


def test_help_groups_and_examples_match_real_parser():
    import shlex
    p = parser()
    discovery = command_catalog(p)
    assert set(discovery["commands"]) == {name for names in discovery["groups"].values() for name in names}
    assert "--root" in {flag for option in discovery["global_options"] for flag in option.get("flags", [])}
    for record in discovery["commands"].values():
        p.parse_args(shlex.split(record["example"])[1:])
