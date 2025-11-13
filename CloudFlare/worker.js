@page "/Timetables"
@using MudBlazor
@using System.Net.Http.Json
@using System.Text.Json
@using System.Xml.Linq
@inject HttpClient Http

<PageTitle>Bus Routes</PageTitle>

<MudContainer MaxWidth="MaxWidth.Large" Class="mt-6 mb-8">
    <MudText Typo="Typo.h4" GutterBottom="true" Align="Align.Center">
        Blacksburg Transit Routes
    </MudText>

    <!-- Search and Filter Controls -->
    <MudPaper Class="p-4 mb-4">
        <MudGrid>
            <MudItem xs="12" md="6">
                <MudTextField @bind-Value="_searchQuery"
                              Placeholder="Search routes..."
                              Label="Search"
                              Adornment="Adornment.Start"
                              AdornmentIcon="@Icons.Material.Filled.Search"
                              Clearable="true"
                              Immediate="true"
                              OnKeyDown="@(e => { if (e.Key == "Enter") ApplyFilters(); })"
                              OnBlurred="@(e => ApplyFilters())" />
            </MudItem>

            <MudItem xs="12" md="6">
                <MudSelect T="string" Label="Filter by Route" @bind-Value="_selectedRouteId" Dense="true" Clearable="true">
                    <MudSelectItem T="string" Value="ALL">All Routes</MudSelectItem>
                    @foreach (var r in _routes)
                    {
                        <MudSelectItem T="string" Value="@r.Id">@r.Name</MudSelectItem>
                    }
                </MudSelect>
            </MudItem>
        </MudGrid>
    </MudPaper>

    <!-- Route Grid Table -->
    <MudTable Items="_filteredRoutes" Hover="true" Dense="true" Elevation="1">
        <HeaderContent>
            <MudTh>Route Name</MudTh>
            <MudTh>Shorthand Name</MudTh>
        </HeaderContent>
        <RowTemplate>
            <MudTd>
                <MudText Typo="Typo.h6"
                         Style="@($"color: #{context.RouteColor}; font-weight:600;")">
                    @context.Name
                </MudText>
            </MudTd>
            <MudTd>
                <MudChip Color="Color.Default"
                         Variant="Variant.Outlined"
                         Style="@($"background-color: #{context.RouteColor}; color: #{context.RouteTextColor}; font-weight:600;")">
                    @context.Short
                </MudChip>
            </MudTd>
        </RowTemplate>

        <NoRecordsContent>
            <MudText Class="p-4" Color="Color.Secondary" Align="Align.Center">
                No routes found for the current search/filter.
            </MudText>
        </NoRecordsContent>
    </MudTable>
</MudContainer>

@code {
    private const string WorkerBase = "https://blue-disk-457f.fionncmurphy.workers.dev/api/bt4u";
    private string _searchQuery = "";
    private string _selectedRouteId = "ALL";

    private sealed record RouteDto(string Id, string Name, string Short, string RouteColor, string RouteTextColor);
    private List<RouteDto> _routes = new();
    private List<RouteDto> _filteredRoutes = new();

    protected override async Task OnInitializedAsync()
    {
        await LoadRoutesAsync();
        ApplyFilters();
    }

    // Load routes from your Cloudflare Worker
    private async Task LoadRoutesAsync()
    {
        try
        {
            var url = $"{WorkerBase}?method=GetCurrentRoutes";
            var json = await Http.GetFromJsonAsync<JsonElement>(url);
            _routes = ParseRoutes(json);
        }
        catch
        {
            _routes = new();
        }
    }

    // Search + filter logic
    private void ApplyFilters()
    {
        IEnumerable<RouteDto> q = _routes;

        if (!string.IsNullOrWhiteSpace(_searchQuery))
        {
            var s = _searchQuery.Trim().ToLowerInvariant();
            q = q.Where(r => r.Name.ToLower().Contains(s) || r.Short.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(_selectedRouteId) && _selectedRouteId != "ALL")
            q = q.Where(r => r.Id == _selectedRouteId);

        _filteredRoutes = q.ToList();
        StateHasChanged();
    }

    // XML parsing from Worker payload
    private static List<RouteDto> ParseRoutes(JsonElement root)
    {
        var list = new List<RouteDto>();

        // BT4U responses usually wrapped in <DocumentElement>
        if (root.ValueKind == JsonValueKind.Object && root.TryGetProperty("xml", out var xmlNode))
        {
            var xml = xmlNode.GetString() ?? "";
            if (!string.IsNullOrWhiteSpace(xml))
            {
                var doc = XDocument.Parse(xml);
                var routes = doc.Descendants("CurrentRoutes");

                foreach (var r in routes)
                {
                    var name = r.Element("RouteName")?.Value ?? "";
                    var shortName = r.Element("RouteShortName")?.Value ?? "";
                    var color = r.Element("RouteColor")?.Value ?? "888888";
                    var textColor = r.Element("RouteTextColor")?.Value ?? "FFFFFF";

                    if (!string.IsNullOrWhiteSpace(shortName))
                    {
                        list.Add(new RouteDto(shortName, name, shortName, color, textColor));
                    }
                }
            }
        }

        return list;
    }
}
