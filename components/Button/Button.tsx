import { Button } from "@rneui/base";
import React from "react";

const ButtonCustom = () => {
  return (
    <Button
      onPress={() => {
        console.log("Button Pressed");
      }}
    >
      Press Me
    </Button>
  );
};

export default ButtonCustom;
