import React, { useState, useEffect } from "react";
import { ComposedChart, XAxis, YAxis, Legend, Bar } from "recharts";

// graphs that compare goal nutrition values to total planned nutrition values
const ProgressGraph = (props) => {
  const [data, setData] = useState([
    {
      nutrient: props.measure,
      planned: props.total[props.measure],
      goal: props.goal.amount,
    },
  ]);
  const [color, setColor] = useState(
    props.total > props.goal.amount
      ? "pink"
      : props.total > 0.7 * props.goal.amount
      ? "#ffb347" // light orange color
      : "lightgreen"
  );

  useEffect(() => {
    setData([
      {
        nutrient: `${props.measure} (${props.goal.unit})`,
        planned: props.total[props.measure],
        goal: props.goal.amount,
      },
    ]);
  }, [props.measure, props.total, props.goal]);

  useEffect(() => {
    setColor(
      props.total[props.measure] > props.goal.amount
        ? "pink"
        : props.total[props.measure] > 0.7 * props.goal.amount
        ? "#ffb347" // light orange color
        : "lightgreen"
    );
  }, [props.measure, props.total, props.goal]);

  return (
    <ComposedChart width={150} height={300} data={data}>
      <XAxis dataKey="nutrient" />
      <YAxis
        domain={[
          0,
          props.total[props.measure] > props.goal.amount
            ? Math.ceil(props.total[props.measure] / 10) * 10
            : Math.ceil((1.2 * props.goal.amount) / 10) * 10,
        ]}
        ticks={
          // evenly space out intervals so that there are five ticks no matter the y max
          props.total[props.measure] > props.goal.amount
            ? [
                0,
                (Math.ceil(props.total[props.measure] / 10) * 10) / 4,
                (Math.ceil(props.total[props.measure] / 10) * 10) / 2,
                (Math.ceil(props.total[props.measure] / 10) * 10 * 3) / 4,
                Math.ceil(props.total[props.measure] / 10) * 10,
              ]
            : [
                0,
                (Math.ceil((1.2 * props.goal.amount) / 10) * 10) / 4,
                (Math.ceil((1.2 * props.goal.amount) / 10) * 10) / 2,
                (Math.ceil((1.2 * props.goal.amount) / 10) * 10 * 3) / 4,
                Math.ceil((1.2 * props.goal.amount) / 10) * 10,
              ]
        }
      />
      <Legend verticalAlgin={"bottom"} iconSize={10} align={"right"} />
      <Bar dataKey="planned" barSize={20} fill={color} />
      <Bar dataKey="goal" barSize={20} fill="#708090" />
    </ComposedChart>
  );
};

export default ProgressGraph;
