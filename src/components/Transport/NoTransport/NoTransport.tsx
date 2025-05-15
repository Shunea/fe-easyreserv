import { plusIcon, uploadIcon } from "../../../icons/icons";
import { NoTransportImage } from "./transportImages";

type Props = {};

const NoTransport = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        maxWidth: "1920px",
        height: "100%",
        minHeight: "1024px",
        padding: "214px 0px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          {NoTransportImage}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              color: "#020202",
              fontFamily: "Inter",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "120%",
              letterSpacing: "-0.64px",
            }}
          >
            You have no transport
          </span>
          <span
            style={{
              color: "#020202",
              textAlign: "center",
              fontFamily: "Inter",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "175%",
            }}
          >
            Let’s start by adding your first transport <br />
            or instantly import the whole car park
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <button
            style={{
              display: "flex",
              padding: "16px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "12px",
              border: "1px solid #EEE",
              background: "#FFF",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                color: "black",
                display: "flex",
              }}
            >
              {uploadIcon}
            </span>
            <span
              style={{
                color: "#020202",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "125%",
              }}
            >
              Import CSV
            </span>
          </button>
          <button
            style={{
              display: "flex",
              padding: "16px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "12px",
              background: "#FE9800",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                color: "white",
                display: "flex",
              }}
            >
              {plusIcon}
            </span>
            <span
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "125%",
              }}
            >
              Create transport
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default NoTransport;
