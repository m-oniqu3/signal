type Props = {};

function usePopup({}: Props) {
  const popupPosition = useCallback(() => {
    if (!hoveredIncident || !mapRef.current) return null;

    return mapRef.current.latLngToContainerPoint(hoveredIncident.latlng);
  }, [hoveredIncident, mapRef]);
  return <div>usePopup</div>;
}

export default usePopup;
