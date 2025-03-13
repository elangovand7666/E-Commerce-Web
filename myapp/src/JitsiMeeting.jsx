import { useEffect, useState } from "react";

const JitsiMeeting = ({ room }) => {
    const [apiLoaded, setApiLoaded] = useState(false);

    useEffect(() => {
        // Wait until Jitsi script is available
        const checkApi = setInterval(() => {
            if (window.JitsiMeetExternalAPI) {
                clearInterval(checkApi);
                setApiLoaded(true);
            }
        }, 100);

        return () => clearInterval(checkApi);
    }, []);

    useEffect(() => {
        if (!apiLoaded || !room) return;

        const domain = "meet.jit.si";
        const options = {
            roomName: room,
            width: "100%",
            height: "700px",
            parentNode: document.getElementById("meet"),
            configOverwrite: { startWithVideoMuted: false, startWithAudioMuted: false },
            interfaceConfigOverwrite: { TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"] },
        };

        new window.JitsiMeetExternalAPI(domain, options);
    }, [apiLoaded, room]);

    return (
        <div>
            {!apiLoaded ? <p>Loading Jitsi API...</p> : <div id="meet" style={{ width: "100%", height: "700px" }} />}
        </div>
    );
};

export default JitsiMeeting;
