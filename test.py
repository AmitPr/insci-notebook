from traitlets.config import Config
import nbformat
from nbconvert import HTMLExporter
import pathlib
PATH = pathlib.Path(__file__).parent.absolute()
print(HTMLExporter.extra_template_basedirs,PATH)
HTMLExporter.extra_template_basedirs=[PATH]
with open('example.ipynb','r+') as f:
    notebook = nbformat.reads('\n'.join(f.readlines()),as_version=nbformat.NO_CONVERT)
html_exporter = HTMLExporter()
html_exporter.template_name = 'test'
(body, resources) = html_exporter.from_notebook_node(notebook)
print(body)