import free_roller from "@/app/assets/node/free_roller.png";
import free_roller_without_edge from "@/app/assets/node/free_roller_without_edge.png";
import mir_robot from "@/app/assets/node/mir.png";
import motor_roller from "@/app/assets/node/motor_roller.png";
import Image from "next/image";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
export const FreeRollerNode = (props: any) => {
  const { size = { width: 160, height: 60 }, data } = props;
  const { width, height } = size;
  const {
    id,
    label = "Free roller",
    chuteDirection = 1,
    markerId = 0,
    chuteType = "",
    boxStack = 1,
    stroke = "#ccc",
    fill = "#fff",
    fontFill,
    fontSize,
  } = data;
  console.log("free comp data:", data);
  // TODO conditional change image direction by x position refer with cart
  // TODO change information show by tooltip

  return (
    <div
      className="indicator-container-free"
      style={{
        position: "relative",
        display: "block",
        background: "#fff",
        border: "1px solid #84b2e8",
        borderRadius: "2px",
        padding: "0rem",
        overflow: "hidden",
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.20)",
        width,
        height,
        borderColor: stroke,
        backgroundColor: fill,
        color: fontFill,
        fontSize,
      }}
    >
      <div
        style={{
          color: fontFill,
          display: "flex",
          transform: chuteDirection === 1 ? "scaleX(-1)" : "scaleX(1)",
          position: "relative",
        }}
      >
        <>
          <BsFillArrowRightCircleFill
            size={30}
            style={{
              position: "absolute",
              top: "15%",
              right: "10%",
              zIndex: "1",
              transform: chuteType.includes("receive")
                ? "scaleX(1)"
                : "scaleX(-1)",
            }}
          />
          <Image src={free_roller} alt="free_roller" />
          <Image src={free_roller_without_edge} alt="motor roller" />
        </>
        {id.startsWith("node") && (
          <>
            <p>{label}</p>
            <p>{chuteDirection === 1 ? "Left" : "Right"}</p>
            <p>{markerId}</p>
            <p>{boxStack}</p>
          </>
        )}
      </div>
    </div>
  );
};

export const MotorRollerNode = (props: any) => {
  const { size = { width: 160, height: 60 }, data } = props;
  const { width, height } = size;
  const {
    id,
    label = "Motor roller",
    transferDirection = 1,
    chuteDirection = 1,
    chuteType = "",
    markerId = 0,
    boxStack = 1,
    motorId = "",
    stroke = "#ccc",
    fill = "#fff",
    fontFill,
    fontSize,
  } = data;
  console.log("motor comp data:", data);

  return (
    <div
      className="indicator-container-motor"
      style={{
        position: "relative",
        display: "block",
        background: "#fff",
        border: "1px solid #84b2e8",
        borderRadius: "2px",
        padding: "0rem",
        overflow: "hidden",
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.20)",
        width,
        height,
        borderColor: stroke,
        backgroundColor: fill,
        color: fontFill,
        fontSize,
      }}
    >
      <div
        style={{
          color: fontFill,
          display: "flex",
          position: "relative",
          transform: chuteDirection === 1 ? "scaleX(-1)" : "scaleX(1)",
        }}
      >
        <>
          <BsFillArrowRightCircleFill
            size={30}
            style={{
              position: "absolute",
              top: "15%",
              right: "10%",
              zIndex: "1",
              transform: chuteType.includes("receive")
                ? "scaleX(1)"
                : "scaleX(-1)",
            }}
          />
          <Image src={free_roller} alt="free_roller" />
          <Image
            src={motor_roller}
            alt="motor roller"
            style={{
              transform: "scaleX(-1)",
            }}
          />
        </>
        {id.startsWith("node") && (
          <>
            <p>{label}</p>
            <p>{transferDirection === 1 ? "Receive" : "Send"}</p>
            <p>{markerId}</p>
            <p>{boxStack}</p>
            <p>{motorId}</p>
          </>
        )}
      </div>
    </div>
  );
};

export const GroupIdNode = (props: any, disabled: boolean = false) => {
  const { size = { width: 160, height: 60 }, data } = props;
  const { width, height } = size;
  const {
    id,
    label = "Group ID",
    transferDirection = 1,
    chuteDirection = 1,
    markerId = 0,
    boxStack = 1,
    motorId = "",
    stroke = "#ccc",
    fill = "#fff",
    fontFill,
    fontSize,
    groupId = 1,
  } = data;
  console.log("group data :", data);

  return (
    <div
      className="indicator-container-group"
      style={{
        position: "relative",
        display: "flex",
        background: "#fff",
        border: "1px solid #84b2e8",
        borderRadius: "2px",
        padding: "0rem",
        overflow: "hidden",
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.20)",
        width,
        height,
        borderColor: stroke,
        backgroundColor: fill,
        color: fontFill,
        fontSize,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: fontFill,
          display: "flex",
          // position: "absolute",
          // top: "40%",
          // right: "40%",

          // transform: chuteDirection === 1 ? "scaleX(1)" : "scaleX(-1)",
        }}
      >
        <></>
        {id.startsWith("node") && (
          <>
            <p>{label}</p>
            {/* <p>{transferDirection === 1 ? "Receive" : "Send"}</p>
            <p>{markerId}</p>
            <p>{boxStack}</p>
            <p>{motorId}</p> */}
          </>
        )}
      </div>
    </div>
  );
};

export const RobotNode = (props: any, disabled: boolean = false) => {
  const { size = { width: 80, height: 55 }, data } = props;
  const { width, height } = size;
  const {
    id,
    label = "Robot",
    transferDirection = 1,
    chuteDirection = 1,
    stroke = "#ccc",
    fill = "#fff",
    fontFill,
    fontSize,
  } = data;
  console.log("robot comp data:", data);

  return (
    <div
      className="indicator-container-robot"
      style={{
        position: "relative",
        display: disabled ? "none" : "block",
        border: "1px solid #84b2e8",
        borderRadius: "2px",
        padding: "0rem",
        overflow: "hidden",
        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.20)",
        width: id.startsWith("node") ? 55 : 80,
        height: id.startsWith("node") ? 80 : 55,
        borderColor: stroke,
        backgroundColor: "transparent",
        color: fontFill,
        fontSize,
      }}
    >
      <div
        style={{
          transform: `${
            !id.startsWith("node") ? "rotate(0deg)" : "rotate(90deg)"
          }`,
        }}
      >
        <>
          <Image
            src={mir_robot}
            alt="mir robot"
            style={{
              transform: transferDirection === 1 ? "scaleX(-1)" : "scaleX(1)",
            }}
            width={80}
            height={55}
          />
        </>
        {id.startsWith("node") && (
          <div style={{ position: "absolute" }}>
            <p>{label}</p>
            <p>{transferDirection === 1 ? "Receive" : "Send"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
