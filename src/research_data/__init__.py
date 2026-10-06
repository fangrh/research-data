"""Scientific run catalog with exact source provenance and reusable plotting."""

__version__ = "0.5.0"


def __getattr__(name):
    if name == "Catalog":
        from .catalog import Catalog
        return Catalog
    raise AttributeError(name)
