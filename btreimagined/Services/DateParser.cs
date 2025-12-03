namespace btreimagined.Services;

public class DateParser
{
    public static bool TryParseDate(string? s, out DateTime dt)
    {
        dt = default;
        if (string.IsNullOrWhiteSpace(s)) return false;

        if (DateTimeOffset.TryParseExact(
                s.Trim(),
                "yyyy-MM-dd'T'HH:mm:sszzz",
                System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.None,
                out var dto))
        {
            dt = dto.LocalDateTime;
            return true;
        }
        return false;
    }
}