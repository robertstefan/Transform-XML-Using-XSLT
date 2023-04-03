using CommandLine;

namespace xml2html.xsltransform
{
    public class ActionInputs
    {
        string _sourceFile = string.Empty;
        string _targetFile = string.Empty;
        string _styleFile = string.Empty;


        [Option('s', "source",
            Required = true,
            HelpText = "The source file, xml datasource:")]
        public string Source { get => _sourceFile; set => ParseAndAssign(value, str => _sourceFile = str); }

        [Option('S', "style",
            Required = true,
            HelpText = "The style file:")]
        public string Style { get => _styleFile; set => ParseAndAssign(value, str => _styleFile = str); }


        [Option('o', "output",
            Required = false,
            HelpText = "The output file, where to write output:")]
        public string Output
        {
            get => _targetFile;
            set
            {
                if (!string.IsNullOrEmpty(value))
                    ParseAndAssign(value, str => _targetFile = str);
                else
                    _targetFile = $"{Path.GetFileNameWithoutExtension(_sourceFile)}.html";
            }
        }

        static void ParseAndAssign(string? value, Action<string> assign)
        {
            if (value is { Length: > 0 } && assign is not null)
            {
                assign(value.Split("/")[^1]);
            }
        }
    }
}