import { useState, useEffect, useMemo } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import ControlPanel from '../components/control-panel';
import { dotLayer, heatmapLayer } from '../components/map-style';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFsLXdvb2QiLCJhIjoiY2oyZ2t2em50MDAyMzJ3cnltMDFhb2NzdiJ9.X-D4Wvo5E5QxeP7K_I3O8w';

function filterFeaturesByDay(featureCollection, time) {
	const date = new Date(time);
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const features = featureCollection.features.filter((feature) => {
		const featureDate = new Date(feature.properties.time);
		return featureDate.getFullYear() === year && featureDate.getMonth() === month && featureDate.getDate() === day;
	});
	return { type: 'FeatureCollection', features };
}

export default function Home() {
	const [allDays, useAllDays] = useState(true);
	const [timeRange, setTimeRange] = useState([0, 0]);
	const [selectedTime, selectTime] = useState(0);
	const [earthquakes, setEarthQuakes] = useState(null);
	const [map, setMap] = useState();
	const [mapLoaded, setMapLoaded] = useState(false);

	useEffect(() => {
		/* global fetch */
		fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
			.then((resp) => resp.json())
			.then((json) => {
				// Note: In a real application you would do a validation of JSON data before doing anything with it,
				// but for demonstration purposes we ingore this part here and just trying to select needed data...
				const features = json.features;
				const endTime = features[0].properties.time;
				const startTime = features[features.length - 1].properties.time;

				setTimeRange([startTime, endTime]);
				setEarthQuakes(json);
				selectTime(endTime);
			})
			.catch((err) => console.error('Could not load data', err)); // eslint-disable-line
	}, []);

	useEffect(() => {
		if (map && mapLoaded) {
			map.loadImage('https://trip.social/images/icons/place-custom-marker.png', (error, image) => {
				if (error) throw error;
				image && map.addImage('custom-marker', image);
			});
		}
	}, [map, mapLoaded]);

	const data = useMemo(() => {
		return allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime);
	}, [earthquakes, allDays, selectedTime]);

	return (
		<div id='map'>
			<MapGL
				initialViewState={{
					latitude: 40,
					longitude: -100,
					zoom: 3,
				}}
				mapStyle='mapbox://styles/mapbox/dark-v9'
				onLoad={() => {
					setMapLoaded(true);
				}}
				mapboxAccessToken={MAPBOX_TOKEN}
				ref={(ref) => ref && setMap(ref.getMap())}
			>
				{data && (
					<Source type='geojson' data={data}>
						<Layer {...heatmapLayer} />
						<Layer {...dotLayer} />
					</Source>
				)}
			</MapGL>
			<ControlPanel
				startTime={timeRange[0]}
				endTime={timeRange[1]}
				selectedTime={selectedTime}
				allDays={allDays}
				onChangeTime={selectTime}
				onChangeAllDays={useAllDays}
			/>
		</div>
	);
}
