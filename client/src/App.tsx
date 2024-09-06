import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const events = new EventSource("http://127.0.0.1:8000/stream");
    console.log(events);
    // events.onmessage = (event) => {
    //   console.log(event);
    //   const parsedData = JSON.parse(event.data);
    //   console.log(parsedData);
    //   setData((data) => data.concat(parsedData));
    // };
    events.onopen = () => console.log(">>> Connection opened!");
    events.onerror = (e) => console.log("ERROR!", e);
    events.addEventListener("new_message", (e) => {
      console.log("Message", e);
      const parsedData = e.data;
      console.log(parsedData);
      setData((data) => data.concat(parsedData));
    });
    events.onmessage = (e) => {
      console.log("Message", e);
      const parsedData = JSON.parse(e.data);
      console.log(parsedData);
      setData((data) => data.concat(parsedData));
    };

    return () => {
      events.close();
    };
  }, []);
  // console.log(data);
  return (
    <div>
      <h1>hello myre</h1>
      <ul>
        {data.map((data, index) => (
          <li key={index}>{data}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
