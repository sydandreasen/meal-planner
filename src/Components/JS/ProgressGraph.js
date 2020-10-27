import React from "react";
import { XYPlot, LineSeries, XAxis, VerticalBarSeries } from "react-vis";
import "../../../node_modules/react-vis/dist/style.css";

const ProgressGraph = (props) => {
  return (
    <XYPlot
      className="graph"
      height={300}
      width={100}
      yDomain={[
        0,
        props.total > props.goal.amount ? props.total : 1.2 * props.goal.amount,
      ]}
    >
      <VerticalBarSeries
        data={[{ x: 1, y: props.total }]}
        color={
          props.total > props.goal.amount
            ? "pink"
            : props.total > 0.7 * props.goal.amount
            ? "#ffb347" // light orange color
            : "lightgreen"
        }
        animation
      />
      <LineSeries
        data={[
          { x: 0, y: props.goal.amount },
          { x: 2, y: props.goal.amount },
        ]}
        color="black"
      />
      <XAxis
        tickFormat={() => `${props.measure}`}
        tickValues={[1]}
        hideLine
        tickSize={0}
      />
    </XYPlot>
  );
};

export default ProgressGraph;
