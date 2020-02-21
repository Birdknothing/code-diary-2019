import React from "react";
import { formatMsg } from "@/locales/index";
const Ww = (window["Mobile_Coms"] || {}).StatusLoading || (() => "");

const StatusLoading = props => <Ww {...props} src="" React={React} formatMessage={({ id }) => formatMsg(id)} />;
export default StatusLoading;
