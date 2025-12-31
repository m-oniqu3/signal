
# Signal
Signal is a map-based incident reporting app that lets users report, discover, and track real-world issues in their area in real time.

## Interactive Incident Map

This map visualizes user-submitted incident reports using Leaflet.

**Key features:**
- Displays incidents as markers clustered for performance
- Fetches incidents based on the current map viewport
- Prevents duplicate markers when refetching data
- Supports creating new incidents by clicking on the map
- Automatically zooms to newly created incidents
- Updates visible data as the user pans or zooms the map

The map is optimized to scale as the number of incidents grows by only
loading data relevant to the visible area.


## Database Types

After updating the Supabase schema, regenerate types:

`npm run supabase:types`


## Progress
```
Map
 ├─ fetch incidents
 ├─ render markers
 └─ opens IncidentReport

Incident Report
  ├─ creates incident
  ├─ returns new incident to Map
  └─ Map adds marker

 ```                   

```  /*
  const fetchIncidentsInView = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const bounds = map.getBounds();

      const incidents = await getIncidentsInBounds({
        south: bounds.getSouth(),
        north: bounds.getNorth(),
        west: bounds.getWest(),
        east: bounds.getEast(),
      });

      incidents?.forEach((incident) => {
        addMarker(incident);
      });
    } catch (error) {
      console.log("Failed to load incidents:", error);
    }
  }, [addMarker]);

  // Debounce using ref
  const fetchIncidentsDebounced = useCallback(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchIncidentsInView();
    }, 300);
  }, [fetchIncidentsInView]);
*/
```