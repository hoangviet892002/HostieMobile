import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useListen = (action: any, callback: any) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(action());
  }, [state]);

  useEffect(() => {
    callback();
  }, [state]);
};

export default useListen;
