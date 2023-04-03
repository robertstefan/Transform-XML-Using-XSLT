# Set the base image as the .NET 6.0 SDK (this includes the runtime)
FROM mcr.microsoft.com/dotnet/sdk:7.0 as build-env

# Copy everything and publish the release (publish implicitly restores and builds)
COPY . ./
RUN dotnet publish ./xml2html-xsl-transform/xml2html-xsl-transform.csproj -c Release -o out --no-self-contained

# Label the container
LABEL maintainer="Robert Stefan"
LABEL repository="https://github.com/robertstefan/Transform-XML-Using-XSLT"
LABEL homepage="https://github.com/robertstefan/Transform-XML-Using-XSLT"

# Label as GitHub action
LABEL com.github.actions.name="xsl-xml2html"
LABEL com.github.actions.description="A Github action that converts a given xml and xsl template, to html"
LABEL com.github.actions.icon="cast"
LABEL com.github.actions.color="purple"

# Relayer the .NET SDK, anew with the build output
FROM mcr.microsoft.com/dotnet/sdk:7.0
COPY --from=build-env /out .
ENTRYPOINT [ "dotnet", "/xsl-xml2html.dll" ]