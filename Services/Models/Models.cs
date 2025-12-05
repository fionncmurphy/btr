namespace btreimagined.Services.Models
{
    public sealed record StopOption(string Code, string Name, double DistanceMeters);

    public sealed record TripRow(string Route, string OriginCode, string OriginName, DateTime Depart,
                                 string DestCode, string DestName, DateTime Arrive)
    {
        public string OriginDisplay => $"{OriginName} ({OriginCode})";
        public string DestDisplay   => $"{DestName} ({DestCode})";
        public string DepartDisplay => Depart.ToString("h:mm tt");
        public string ArriveDisplay => Arrive.ToString("h:mm tt");
    }
}
