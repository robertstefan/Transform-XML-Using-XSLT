using System.Xml;
using System.Xml.Xsl;

using xml2html.xsltransform;

internal class XslTransform
{
    private string _sourceFile { get; set; }
    private string _stylesheet { get; set; }
    private string _outputFile { get; set; }

    string exceptionSource = "";
    string exceptionMessage = "";

    public XslTransform(ActionInputs inputs)
    {
        _sourceFile = inputs.Source.ToString();
        _stylesheet = inputs.Style.ToString();

        if (inputs.Output != null)
            _outputFile = inputs.Output.ToString();
        else
        {
            _outputFile = $"{Path.GetFileNameWithoutExtension(_sourceFile)}.html";
        }
    }

    public void Run()
    {
        try
        {
            // Enable XSLT debugging.
            XslCompiledTransform xslt = new XslCompiledTransform(true);

            // Compile the style sheet.
            xslt.Load(_sourceFile);

            string? githubOutputFile = Environment.GetEnvironmentVariable("GITHUB_OUTPUT", EnvironmentVariableTarget.Process);

            // Execute the XSLT transform.
            FileStream outputStream = new FileStream(Path.Combine(githubOutputFile, _outputFile), FileMode.Create);

            xslt.Transform(_sourceFile, null, outputStream);

            Console.WriteLine("'{0}' Output file has been generated!", _outputFile);
        }

        catch (XsltException xslExc)
        {
            exceptionSource = xslExc.SourceUri;
            exceptionMessage = xslExc.Message;
        }
        catch (XmlException xmlExc)
        {
            exceptionSource = xmlExc.SourceUri;
            exceptionMessage = xmlExc.Message;
        }
        catch (Exception ex)
        {
            exceptionSource = ex.Source;
            exceptionMessage = ex.Message;
        }
        finally
        {
            // In case exception raised
            if (exceptionMessage.Length > 0 || exceptionSource.Length > 0)
            {
                Console.WriteLine("-------------------------------------------------");
                Console.WriteLine("Something went wrong! Here is the error:");
                Console.WriteLine("Source: " + exceptionSource);
                Console.WriteLine("Error Message: " + exceptionMessage);
                Console.WriteLine("-------------------------------------------------");
            }
        }
    }
}