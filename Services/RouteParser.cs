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