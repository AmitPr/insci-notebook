from traitlets.config import Config
import nbformat
from nbconvert import HTMLExporter
from LiveHTMLExporter import LiveHTMLExporter
import pathlib

c = Config()

#Add this directory to the path that nbconvert searches for templates in
PATH = pathlib.Path(__file__).parent.absolute()
c.HTMLExporter.extra_template_basedirs=[PATH]

#Read in example
with open('Time_Space_Complexity.ipynb','r+') as f:
    notebook = nbformat.reads('\n'.join(f.readlines()),as_version=nbformat.NO_CONVERT)

html_exporter = LiveHTMLExporter(config=c,template_name='test', theme='light')
(body, resources) = html_exporter.from_notebook_node(notebook)
print(resources.keys())

#Export output to file
with open(PATH / 'example-out.html','w+') as f:
    f.write(body)