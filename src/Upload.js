import { React, useState } from "react";
import { create } from "ipfs-http-client";

const { REACT_APP_IPFS_PROJECT_ID, REACT_APP_IPFS_PROJECT_KEY } = process.env

const projectId = REACT_APP_IPFS_PROJECT_ID;
const projectKey = REACT_APP_IPFS_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectKey);

function Upload() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [uploaded, setUploaded] = useState([]);

    const ipfs = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization,
        },
    });

    const uploadIPFS = async(event) => {
        event.preventDefault();
        const form = event.target;

        const files = form[0].files;

        if (!files || files.length === 0) {
            return alert("No files were selected");
        }
    
        const file = files[0];
        // upload files
        const result = await ipfs.add(file);

        setUploaded([
            ...uploaded,
            {
                cid: result.cid,
                path: result.path,
            },
        ]);
        console.log("https://ngandt.infura-ipfs.io/ipfs/" +result.path);

        form.reset();
    }

    return (
        <div className="App">
            <header className="App-header">
                { ipfs ? (
                    <div>
                        <h1>Upload IPFS</h1>
                        <form onSubmit={uploadIPFS}>
                            <input id="file-upload" type="file" multiple accept="image/*" />
                            {/* <button type="submit">Upload image</button> */}
                        </form>
                    </div>
                ) : null}
                <div className="data">
                    { uploaded.map((images, index) => (
                    <div key={index}>
                        <img 
                        className="image"
                        alt={`Index file ${index + 1}`}
                        src={"https://ngandt.infura-ipfs.io/ipfs/" + images.path}
                        key={images.cid.toString() + index}
                        style={{ maxWidth: "400px", margin: "15px" }}
                        />

                        <h3>Link to IPFS: </h3>
                        <a href={"https://ngandt.infura-ipfs.io/ipfs/" + images.path} >
                            <h4>Here</h4>
                        </a>
                    </div>
                    ))}
                </div>
            </header>
        </div>
    )
}

export default Upload;
