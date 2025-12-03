/*
    AI DISCLOSURE

    The following file, excluding minor class-specific edits and some test-case manipulation, was generated using ChatGPT. 
    The prompt used is provided below.

    Prompt: Hello! I am a software engineering student and am writing some unit tests for a Cloudflare Blazor project using xUnit. I have my project set up, but I am looking to write a test for a function that parses XML received from an API call. I've included the function below. Could you give me a general framework of the test? Please also explain why you made certain decisions, as I am not very familiar with xUnit but want to learn more about it. Here is the date parsing function: public static bool TryParseDate(string? s, out DateTime dt) { dt = default; if (string.IsNullOrWhiteSpace(s)) return false; if (DateTimeOffset.TryParseExact( s.Trim(), "yyyy-MM-dd'T'HH:mm:sszzz", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var dto)) { dt = dto.LocalDateTime; return true; } return false; }
*/

using System;
using Xunit;
using btreimagined.Services;

namespace btreimagined.Tests;

public class DateParserTest
{
    //Note for valid tests: TryParseDate converts into local (EST) time
    [Theory]
    [InlineData("2024-01-15T13:45:00+02:00", 2024, 1, 15, 6, 45, 0)]
    [InlineData("2020-12-31T23:59:59-05:00", 2020, 12, 31, 23, 59, 59)]
    public void TryParseDate_ValidDates_ReturnsTrue(
        string input,
        int year,
        int month,
        int day,
        int hour,
        int minute,
        int second)
    {
        // Act
        var result = DateParser.TryParseDate(input, out var dt);

        // Assert
        Assert.True(result);
        Assert.Equal(year, dt.Year);
        Assert.Equal(month, dt.Month);
        Assert.Equal(day, dt.Day);
        Assert.Equal(hour, dt.Hour);
        Assert.Equal(minute, dt.Minute);
        Assert.Equal(second, dt.Second);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void TryParseDate_EmptyOrNull_ReturnsFalse(string input)
    {
        var result = DateParser.TryParseDate(input, out var dt);

        Assert.False(result);
        Assert.Equal(default, dt);
    }

    [Theory]
    [InlineData("not-a-date")]
    [InlineData("2024-01-15")]                      // Missing time + offset
    [InlineData("2024-01-15T13:45:00")]             // Missing timezone
    public void TryParseDate_InvalidFormat_ReturnsFalse(string input)
    {
        var result = DateParser.TryParseDate(input, out var dt);

        Assert.False(result);
        Assert.Equal(default, dt);
    }
}
