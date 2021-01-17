import os
from setuptools import setup, find_packages
from importlib.machinery import SourceFileLoader

version = (
    SourceFileLoader("tensorboard_projects.version",
                     os.path.join("tensorboard_projects", "version.py")).load_module().__version__
)

# read the contents of your README file
this_directory = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()


def package_files(directory):
    paths = []
    for (path, _, filenames) in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join("..", path, filename))
    return paths


js_files = package_files("tensorboard_projects/server/js/build")

setup(
    name="tensorboard-projects",
    long_description=long_description,
    long_description_content_type='text/markdown',
    version=version,
    packages=find_packages(),
    package_data={"tensorboard_projects": js_files},
    install_requires=[
        "click>=7.0"
        "Flask",
        "flask-cors",
        "gunicorn",
        "tensorboard"
    ],
    entry_points="""
    [console_scripts]
    tensorboard-projects=tensorboard_projects.cli:cli
    """,
    description="Tensorboard Projects: A management UI for Tensorboard dashboards",
    python_requires=">=2.7,!= 3.0.*,!= 3.1.*,!= 3.2.*,!= 3.3.*,!= 3.4.*,!= 3.5.*"
)
