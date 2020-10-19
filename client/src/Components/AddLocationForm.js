import React from 'react';

export default function AddLocationForm(props) {

    const{ handleLocationOnChange, handleAddLocation, addLocationError, imgPreview} = props
    
    // Date validation
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if (dd<10){
        dd='0'+dd
    } 
    if (mm<10){
        mm='0'+mm
    } 

    today = yyyy+'-'+mm+'-'+dd;

    return (
        <div>
            <form className="add-location-form">
                <h3>Add a place</h3>
                        <div className="form-group">
                            <label htmlFor="title">Name</label>
                            <input type="text" id="title" onChange={(e)=> handleLocationOnChange(e)} required className="form-control"/>
                        </div>
                        {addLocationError ? <div><small className="required-field">This is a required field</small></div> : null} 
                        <div className="form-group">
                            <label htmlFor="description">Notes</label>
                            <textarea id="description" rows="4" cols="20" onChange={(e)=> handleLocationOnChange(e)} className="form-control" />
                        </div>
                        {/* <div className="form-group">
                            <label htmlFor="image">Photo</label>
                            <input type="text" id="image" onChange={(e)=> handleLocationOnChange(e)} className="form-control"/>
                        </div> */}
                        <div className="form-group">
                            <label htmlFor="image">Photo</label>
                            <input type="file" id="image" onChange={(e)=> handleLocationOnChange(e)} />
                        </div>
                        {imgPreview ? <img src={imgPreview} alt="preview" style={{height: "100px"}}/> : null}
                        <div className="form-group">
                            <label htmlFor="rating">Rating</label>
                            <select id="rating" name="rating" onChange={(e)=> handleLocationOnChange(e)} className="form-control">
                                <option value="0">Select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="visited_at">Visited on</label>
                            <input type="date" id="visited_at" max={today} required onChange={(e)=> handleLocationOnChange(e)} className="form-control" />
                        </div>
                        {addLocationError ? <div><small className="required-field">This is a required field</small></div> : null} 
                            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={(e)=>handleAddLocation(e)}>Add</button>
                    </form> 
        </div>
    )
}
