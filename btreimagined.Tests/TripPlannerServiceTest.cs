using Xunit;
using btreimagined.Services;
using btreimagined.Services.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace btreimagined.Tests
{
    /*
     AI-GENERATED TESTS (allowed for PM5)
     Prompt: "Generate xUnit tests for TripPlannerService.OnOriginChangedAsync"
     Date: 2025-12-05
    */

    public class TripPlannerServiceTests
    {
        [Fact]
        public async Task OnOriginChangedAsync_SetsOriginAndClearsDestinationAndTripRows()
        {
            // Arrange
            bool refreshCalled = false;
            var service = new TripPlannerService(async (s) =>
            {
                refreshCalled = true;
                await Task.CompletedTask;
            });

            var stop = new StopOption("ABC", "Test Stop", 123);

            // Act
            await service.OnOriginChangedAsync(stop);

            // Assert
            Assert.Equal(stop, service.Origin);
            Assert.Null(service.Destination);
            Assert.Empty(service.TripRows);
            Assert.True(refreshCalled);
        }

        [Fact]
        public async Task OnOriginChangedAsync_WithNullOrigin_ClearsState()
        {
            // Arrange
            bool refreshCalled = false;
            var service = new TripPlannerService(async (s) =>
            {
                refreshCalled = true;
                await Task.CompletedTask;
            });

            // Act
            await service.OnOriginChangedAsync(null);

            // Assert
            Assert.Null(service.Origin);
            Assert.Null(service.Destination);
            Assert.Empty(service.TripRows);
            Assert.True(refreshCalled);
        }
    }
}
