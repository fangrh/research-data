"""Scientific run catalog with exact source provenance and reusable plotting."""

__version__ = "0.7.1"


def __getattr__(name):
    if name == "Catalog":
        from .catalog import Catalog
        return Catalog
    raise AttributeError(name)
