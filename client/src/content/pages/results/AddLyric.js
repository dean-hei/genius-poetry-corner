import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AddLyric(props) {
    const [clicked, setClicked] = useState(false)
    const [userPoems, setUserPoems] = useState([]);

    useEffect(() => {
        // do an axios call to get user poems
        if (props.user) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/profile/${props.user.id}`, {
                headers: {
                    "Authorization": `Bearer ${props.token}`
                }
            })
            .then(response => {
                if (response.data.results) {
                    setUserPoems(response.data.results)
                }
            }).catch(err => {
                console.log(err)
            })
        }
        // setUserPoems([{ 
            //     title: "Red Thread", 
            //     id: 1
            // }, {
            //     title: "Blue Shoes",
            //     id: 2
            // }])
    }, [])


    const handleClick = (e) => {
        if (clicked) {
            setClicked(false);
        } else {
            setClicked(true);
        }
    }

    const handleSubmitAdd = (e) => {
        e.preventDefault()
        // do an axios call to add the lyric to the db
        if (props.user && props.songInfo) {
            let song = props.songInfo.title;
            let artist = props.songInfo.artist;
            let thumbnail = props.songInfo.img;
            let content = props.line;
            let path = props.songInfo.link;
            let order = 1;
            axios.post(`${process.env.REACT_APP_SERVER_URL}/poems/${props.user.id}`, {  
                song,
                artist,
                thumbnail,
                content,
                path,
                order
            }, {
                headers: {
                    "Authorization": `Bearer ${props.token}`
                }
            })
            .then(response => {
                console.log("DAT DATA", response)
                if (response.data.result) {
                    setClicked("submitted");
                } 
            }).catch(err => {
                console.log(err);
            })
        }
    }

    let plusButton = (<button onClick={handleClick}>+</button>);
    
    if (clicked) {
        if (!props.user) {
            console.log('THERE BE NO USER')
            plusButton = (<span>
                <Link to='/auth/login'>Log in</Link> to add a lyric to your poem
            </span>)
        } else if (clicked=="submitted") {
            plusButton = (<span>Lyric successfully added!</span>)
        } else {
            // show form to add a poem
            let options = userPoems.map(poem => {
                return (<option value={poem.id}>{poem.title}</option>)
            })
            let selectPoem = !options? (<p>You don't have any poems. <Link to='/poems/new'>Create a new poem</Link></p>)
                : (<select name="poem_id">{options}</select>)
            plusButton = (<form onSubmit={handleSubmitAdd}>
                <div>
                    <label>Add to poem:</label>
                    {selectPoem}
                    <button className="form-button" type="submit">Add Lyric</button>
                </div>
            </form>)
        }
    }

    return (
        <span>
            {plusButton}
        </span>
    )
}