from nbconvert import HTMLExporter
import sys


class LiveHTMLExporter(HTMLExporter):
    def from_notebook_node(self, nb, resources=None, **kw):
        self.register_filter("format_code", FormatCodeFilter())
        self.register_filter("static_resource_path", StaticResourceFilter())
        self.register_filter("debug", DebugFilter())
        return super().from_notebook_node(nb, resources, **kw)


class FormatCodeFilter:
    def __call__(self, source, metadata=None):
        """
        Return a properly format source code, ready for editor
        ----------
        source : str
            source of the cell to highlight
        metadata : NotebookNode cell metadata
            metadata of the cell to highlight
        """
        return source.strip()


class StaticResourceFilter:
    def __call__(self, inp):
        """
        Prepend the input with the static resource path
        ----------
        inp : str
            string to output
        """
        prefix = ""
        if len(sys.argv) > 3:
            prefix = sys.argv[3] + "/"
        return prefix + inp


class DebugFilter:
    def __call__(self, inp):
        """
        Prints out the input, for debugging purposes
        ----------
        inp : str
            string to output
        """
        print(inp)
        return inp
