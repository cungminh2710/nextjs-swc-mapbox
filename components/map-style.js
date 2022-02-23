const MAX_ZOOM_LEVEL = 9;

export const heatmapLayer = {
	id: 'heatmap',
	maxzoom: MAX_ZOOM_LEVEL,
	type: 'heatmap',
	paint: {
		// Increase the heatmap weight based on frequency and property magnitude
		'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
		// Increase the heatmap color weight weight by zoom level
		// heatmap-intensity is a multiplier on top of heatmap-weight
		'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
		// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
		// Begin color ramp at 0-stop with a 0-transparancy color
		// to create a blur-like effect.
		'heatmap-color': [
			'interpolate',
			['linear'],
			['heatmap-density'],
			0,
			'rgba(33,102,172,0)',
			0.2,
			'rgb(103,169,207)',
			0.4,
			'rgb(209,229,240)',
			0.6,
			'rgb(253,219,199)',
			0.8,
			'rgb(239,138,98)',
			0.9,
			'rgb(255,201,101)',
		],
		// Adjust the heatmap radius by zoom level
		'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
		// Transition from heatmap to circle layer by zoom level
		'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
	},
};

export const dotLayer = {
	type: 'symbol',
	layout: {
		'icon-image': 'custom-marker',
		'icon-size': 0.7,
		'text-field': ['get', 'name'],
		'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
		'text-offset': [1, -0.6],
		'text-anchor': 'top-left',
		'text-size': 12,
		'text-justify': 'left',
		// 'text-max-width': 5,
		// 'text-optional': true,
		// visibility: 'none',
	},
	paint: {
		'text-color': '#005192',
		'text-halo-color': 'rgba(255,255,255,1)',
		'text-halo-width': 1,
		'text-halo-blur': 1,
		'text-opacity': ['interpolate', ['linear'], ['zoom'], 5.5, 0, 6, 1],
		'icon-opacity': ['interpolate', ['linear'], ['zoom'], 5.5, 0, 6, 1],
	},
};
