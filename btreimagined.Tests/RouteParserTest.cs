/*
    AI DISCLOSURE

    The following file, excluding minor class-specific edits and some test-case manipulation, was generated using ChatGPT. 
    The prompt used is provided below.

    I need to write a test unit for a Cloudflare Blazor project using xUnit. All of the implementation has been done, but 
    now my team is in the testing phase of the project. Can you give me a general framework of a test for my RouteParser.cs 
    file? Also can you explain why you chose to code certain parts of the test in that way and how it is different from jUnit 
    tests? I have never worked with xUnit testing, only jUnit, and have also never worked with Cloudflare Blazor before, so 
    this is all new to me and I want to learn more about it! Here is my code for the RouteParser.cs file: 
        using System.Text.Json;
        using System.Xml.Linq;

        namespace btreimagined.Services;

        public class RouteParser
        {
            public static List<(string Short, string Name, string RouteColor, string RouteTextColor)> ParseRoutes(JsonElement root)
            {
                var list = new List<(string, string, string, string)>();

                if (root.ValueKind == JsonValueKind.Object && root.TryGetProperty("xml", out var xmlNode))
                {
                    var xml = xmlNode.GetString() ?? "";
                    if (!string.IsNullOrWhiteSpace(xml))
                    {
                        var doc = XDocument.Parse(xml);
                        foreach (var e in doc.Descendants("CurrentRoutes"))
                        {
                            var name = e.Element("RouteName")?.Value?.Trim() ?? "";
                            var shortName = e.Element("RouteShortName")?.Value?.Trim() ?? "";
                            var color = e.Element("RouteColor")?.Value?.Trim() ?? "888888";
                            var text = e.Element("RouteTextColor")?.Value?.Trim() ?? "FFFFFF";

                            if (!string.IsNullOrWhiteSpace(shortName) && !string.IsNullOrWhiteSpace(name))
                                list.Add((shortName, name, color, text));
                        }
                    }
                }
                return list;
            }
        }
*/

using System.Text.Json;
using Xunit;
using btreimagined.Services;

public class RouteParserTests
{
    [Fact]
    public void ParseRoutes_ReturnsList_WhenValidXml()
    {
        // Arrange: Build JSON structure containing your XML
        string json = """
        {
            "xml": "<Root><CurrentRoutes><RouteName>Main Street</RouteName><RouteShortName>MS</RouteShortName><RouteColor>123456</RouteColor><RouteTextColor>FFFFFF</RouteTextColor></CurrentRoutes></Root>"
        }
        """;

        var doc = JsonDocument.Parse(json);
        JsonElement root = doc.RootElement;

        // Act
        var routes = RouteParser.ParseRoutes(root);

        // Assert
        Assert.Single(routes);
        Assert.Equal("MS", routes[0].Short);
        Assert.Equal("Main Street", routes[0].Name);
        Assert.Equal("123456", routes[0].RouteColor);
        Assert.Equal("FFFFFF", routes[0].RouteTextColor);
    }

    [Fact]
    public void ParseRoutes_IgnoresEntriesWithMissingNames()
    {
        // Arrange: shortName exists but name missing
        string json = """
        {
            "xml": "<Root><CurrentRoutes><RouteShortName>MS</RouteShortName></CurrentRoutes></Root>"
        }
        """;

        var doc = JsonDocument.Parse(json);
        JsonElement root = doc.RootElement;

        // Act
        var routes = RouteParser.ParseRoutes(root);

        // Assert
        Assert.Empty(routes); // must ignore invalid route
    }

    [Fact]
    public void ParseRoutes_ReturnsEmptyList_WhenXmlMissing()
    {
        // Arrange
        string json = """ { "xml": "" } """;

        var doc = JsonDocument.Parse(json);

        // Act
        var routes = RouteParser.ParseRoutes(doc.RootElement);

        // Assert
        Assert.Empty(routes);
    }

    [Fact]
    public void ParseRoutes_ReturnsEmptyList_WhenJsonHasNoXmlProperty()
    {
        // Arrange
        string json = """ { "somethingElse": 5 } """;
        var doc = JsonDocument.Parse(json);

        // Act
        var routes = RouteParser.ParseRoutes(doc.RootElement);

        // Assert
        Assert.Empty(routes);
    }
}