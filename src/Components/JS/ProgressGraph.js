import React, { useState, useEffect } from "react";
import { ComposedChart, XAxis, YAxis, Legend, Bar } from "recharts";

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
        nutrient: props.measure,
        planned: props.total[props.measure],
        goal: props.goal.amount,
      },
    ]);
  }, [props.measure, props.total, props.goal]);

  useEffect(() => {
    setColor(
      props.total > props.goal.amount
        ? "pink"
        : props.total > 0.7 * props.goal.amount
        ? "#ffb347" // light orange color
        : "lightgreen"
    );
  }, [props.measure, props.total, props.goal]);
  return (
    <ComposedChart width={150} height={300} data={data}>
      <XAxis dataKey="nutrient" />
      <YAxis
        // label={props.goal.unit}
        domain={[
          0,
          props.total > props.goal.amount
            ? props.total
            : 1.2 * props.goal.amount,
        ]}
      />
      <Legend />
      <Bar dataKey="planned" barSize={20} fill={color} />
      <Bar dataKey="goal" barSize={20} fill="#708090" />
    </ComposedChart>
  );
};

export default ProgressGraph;
