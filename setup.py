import os
from setuptools import setup, find_packages
from importlib.machinery import SourceFileLoader

version = (
    SourceFileLoader("tensorboard_projects.version",
                     os.path.join("tensorboard_projects", "version.py")).load_module().VERSION
)


def package_files(directory):
    paths = []
    for (path, _, filenames) in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join("..", path, filename))
    return paths


js_files = package_files("tensorboard_projects/server/js/build")

setup(
    name="multi-tensorboard",
    version=version,
    packages=find_packages(),
    package_data={"tensorboard_projects": js_files},
    install_requires=[
        "gunicorn",
        "Flask",
        "tensorboard"
    ],
    entry_points="""
    [console_scripts]
    tensorboard-projects=tensorboard_projects.cli:cli
    """,
    description="Tensorboard Projects: A multi project UI for Tensorboard",
    python_requires=">=3.5"
)
