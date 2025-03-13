import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import JitsiMeeting from "./JitsiMeeting";

function Meeting() {
    const { email1, email2, room } = useParams();
    const [meetingRoom, setMeetingRoom] = useState(room);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!meetingRoom) {
            axios.get(`http://127.0.0.1:8000/api/create-meeting/${email1}/${email2}/`)
                .then(response => {
                    setMeetingRoom(response.data.room_name);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching meeting room:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [email1, email2, meetingRoom]);

    return (
        <div>
            <h2 class="Cato">Join Video Meeting</h2>
            {loading ? (
                <p class="Cato">Loading meeting...</p>
            ) : meetingRoom ? (
                <JitsiMeeting room={meetingRoom} />
            ) : (
                <p>Failed to create meeting. Please try again.</p>
            )}
        </div>
    );
}

export default Meeting;