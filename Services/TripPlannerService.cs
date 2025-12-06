using btreimagined.Services.Models;

namespace btreimagined.Services
{
    public class TripPlannerService
    {
        public StopOption? Origin { get; private set; }
        public StopOption? Destination { get; private set; }
        public List<TripRow> TripRows { get; private set; } = new();

        private readonly Func<StopOption?, Task> _refreshOriginRoutesAsync;

        public TripPlannerService(Func<StopOption?, Task> refreshOriginRoutesAsync)
        {
            _refreshOriginRoutesAsync = refreshOriginRoutesAsync;
        }

        public async Task OnOriginChangedAsync(StopOption? s)
        {
            Origin = s;
            Destination = null;
            TripRows.Clear();
            if (_refreshOriginRoutesAsync != null)
                await _refreshOriginRoutesAsync(s);
        }
    }
}
