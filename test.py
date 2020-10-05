from traitlets.config import Config
import nbformat
from nbconvert import HTMLExporter
import pathlib

c = Config()

#Add this directory to the path that nbconvert searches for templates in
PATH = pathlib.Path(__file__).parent.absolute()
c.HTMLExporter.extra_template_basedirs=[PATH]

#Read in example
with open('example.ipynb','r+') as f:
    notebook = nbformat.reads('\n'.join(f.readlines()),as_version=nbformat.NO_CONVERT)

html_exporter = HTMLExporter(config=c,template_name='test')
(body, resources) = html_exporter.from_notebook_node(notebook)

#Export output to file
with open('example-out.html','w+') as f:
    f.write(body)