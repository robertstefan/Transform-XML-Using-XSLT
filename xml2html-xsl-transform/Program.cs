using CommandLine;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using xml2html.xsltransform;

using IHost host = Host.CreateDefaultBuilder(args)
    .Build();

static TService Get<TService>(IHost host)
    where TService : notnull =>
    host.Services.GetRequiredService<TService>();


static async Task StartTransform(ActionInputs inputs, IHost host)
{
    using CancellationTokenSource tokenSource = new();

    Console.CancelKeyPress += delegate
    {
        tokenSource.Cancel();
    };

    XslTransform transformer = new XslTransform(inputs);
    transformer.Run();

    Environment.Exit(0);
}

var parser = Parser.Default.ParseArguments<ActionInputs>(() => new(), args);
parser.WithNotParsed(errors =>
{
    Get<ILoggerFactory>(host)
       .CreateLogger("xml2html.xsltransform.Program")
            .LogError(
                string.Join(Environment.NewLine, errors.Select(error => error.ToString())));

    Environment.Exit(2);
});

await parser.WithParsedAsync(options => StartTransform(options, host));
await host.RunAsync();
