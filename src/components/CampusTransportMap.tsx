import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CampusTransportStop = {
  id: string;
  name: string;
  detail: string;
  minutesFromStart: number;
  point: { x: number; y: number };
};

type CampusTransportMapProps = {
  routeName: string;
  routeColor: string;
  stops: CampusTransportStop[];
  selectedStopId: string;
  onSelectStop: (stopId: string) => void;
  expanded?: boolean;
};

type Point = { x: number; y: number };

const MAP_HEIGHT = 228;

const BACKGROUND_ROADS: [Point, Point][] = [
  [{ x: 0.04, y: 0.23 }, { x: 0.96, y: 0.42 }],
  [{ x: 0.12, y: 0.9 }, { x: 0.8, y: 0.08 }],
  [{ x: 0.95, y: 0.82 }, { x: 0.24, y: 0.1 }],
  [{ x: 0.02, y: 0.58 }, { x: 0.96, y: 0.7 }],
];

function MapLine({
  from,
  to,
  width,
  color,
  thickness,
}: {
  from: Point;
  to: Point;
  width: number;
  color: string;
  thickness: number;
}) {
  const x1 = from.x * width;
  const y1 = from.y * MAP_HEIGHT;
  const x2 = to.x * width;
  const y2 = to.y * MAP_HEIGHT;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = `${(Math.atan2(dy, dx) * 180) / Math.PI}deg`;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: length,
        height: thickness,
        left: (x1 + x2) / 2 - length / 2,
        top: (y1 + y2) / 2 - thickness / 2,
        borderRadius: thickness,
        backgroundColor: color,
        transform: [{ rotate: angle }],
      }}
    />
  );
}

export function CampusTransportMap({
  routeName,
  routeColor,
  stops,
  selectedStopId,
  onSelectStop,
  expanded = false,
}: CampusTransportMapProps) {
  const [mapWidth, setMapWidth] = useState(0);
  const height = expanded ? 300 : MAP_HEIGHT;
  const scaleY = height / MAP_HEIGHT;

  return (
    <View
      accessibilityLabel={`${routeName} shuttle route map`}
      onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)}
      style={{
        height,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#EFF3EF',
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: '5%',
          top: '9%',
          width: '28%',
          height: '23%',
          borderRadius: 20,
          backgroundColor: '#DCEBDD',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: '6%',
          bottom: '8%',
          width: '25%',
          height: '27%',
          borderRadius: 18,
          backgroundColor: '#E2ECDD',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: '42%',
          top: '8%',
          width: '18%',
          height: '16%',
          borderRadius: 10,
          backgroundColor: '#E7E4D9',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: '40%',
          bottom: '11%',
          width: '17%',
          height: '18%',
          borderRadius: 10,
          backgroundColor: '#E7E4D9',
        }}
      />

      {BACKGROUND_ROADS.map(([from, to], index) => (
        <MapLine
          key={`road-${index}`}
          from={{ ...from, y: from.y * scaleY }}
          to={{ ...to, y: to.y * scaleY }}
          width={mapWidth}
          color="#FFFFFF"
          thickness={index === 0 ? 13 : 9}
        />
      ))}

      {stops.slice(0, -1).map((stop, index) => {
        const nextStop = stops[index + 1];
        return (
          <React.Fragment key={`${stop.id}-${nextStop.id}`}>
            <MapLine
              from={{ ...stop.point, y: stop.point.y * scaleY }}
              to={{ ...nextStop.point, y: nextStop.point.y * scaleY }}
              width={mapWidth}
              color="#FFFFFF"
              thickness={10}
            />
            <MapLine
              from={{ ...stop.point, y: stop.point.y * scaleY }}
              to={{ ...nextStop.point, y: nextStop.point.y * scaleY }}
              width={mapWidth}
              color={routeColor}
              thickness={5}
            />
          </React.Fragment>
        );
      })}

      {stops.map((stop, index) => {
        const selected = selectedStopId === stop.id;
        const markerTop = stop.point.y * height;
        const labelTop = markerTop < height / 2 ? markerTop + 17 : markerTop - 39;

        return (
          <React.Fragment key={stop.id}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Choose ${stop.name} as your pickup stop`}
              onPress={() => onSelectStop(stop.id)}
              style={{
                position: 'absolute',
                left: stop.point.x * mapWidth - 14,
                top: markerTop - 14,
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? routeColor : '#FFFFFF',
                borderWidth: 2.5,
                borderColor: '#FFFFFF',
                shadowColor: '#202B49',
                shadowOpacity: 0.15,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
                zIndex: 3,
              }}
            >
              <Text
                style={{
                  color: selected ? '#FFFFFF' : routeColor,
                  fontSize: 10,
                  fontWeight: '800',
                }}
              >
                {index + 1}
              </Text>
            </Pressable>
            {selected && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: Math.max(4, Math.min(mapWidth - 108, stop.point.x * mapWidth - 46)),
                  top: Math.max(4, Math.min(height - 29, labelTop)),
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 9,
                  borderWidth: 1,
                  borderColor: '#E9EDF5',
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 7,
                  paddingVertical: 5,
                  zIndex: 4,
                }}
              >
                <Ionicons name="location" size={11} color={routeColor} />
                <Text
                  numberOfLines={1}
                  style={{
                    maxWidth: 78,
                    marginLeft: 3,
                    color: '#202B49',
                    fontSize: 9,
                    fontWeight: '700',
                  }}
                >
                  {stop.name}
                </Text>
              </View>
            )}
          </React.Fragment>
        );
      })}

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: 12,
          top: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.92)',
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <Ionicons name="navigate-outline" size={12} color="#7F8AA3" />
        <Text
          style={{
            marginLeft: 4,
            color: '#7F8AA3',
            fontSize: 9,
            fontWeight: '700',
          }}
        >
          N
        </Text>
      </View>
    </View>
  );
}
