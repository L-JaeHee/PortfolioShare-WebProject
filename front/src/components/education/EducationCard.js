import React, { useState, useRef, useEffect } from "react";
import "../../../src/index.css";
import EducationForm from "./EducationForm";
import * as Api from "../../api";
import { Col, Button, Overlay, Tooltip } from "react-bootstrap";
import DeleteButton from "./DeleteButton";

function EducationCard({ educations, setEducations, isEditable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [byEditbtn, setByEditbtn] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const toggleEditEducationForm = (id) => {
    if (targetId === id && isEditing) {
      setTargetId(null);
      setIsEditing(false);
    } else {
      setTargetId(id);
      setIsEditing(true);
    }
  };

  const confirmEditEducation = (targetEducation) => {
    const resultEducations = [...educations];
    resultEducations[
      resultEducations.findIndex(
        (education) => education.id === targetEducation.id
      )
    ] = {
      ...targetEducation,
    };
    setEducations([...resultEducations]);
    cancelEditEducation();
  };

  const cancelEditEducation = () => {
    setIsEditing(false);
    setTargetId(null);
  };

  const onRemove = async (educationid) => {
    setEducations(
      educations.filter((education) => education.id !== educationid)
    );
    await Api.delete(`educations/${educationid}`);
  };

  const EditHandle = () => {
    setByEditbtn(true);
  };

  return (
    <div>
      <div>
        {educations.map((education, index) => {
          return (
            <div key={education.id}>
              <div className="align-items-center row margin_tb10">
                <div className="col">
                  <div>{education.school}</div>
                  <div>
                    {education.major}({education.position})
                  </div>
                </div>
                {isEditable ? (
                  <Col
                    className="col-lg-1 col"
                    style={{ width: "138px", display: "flex" }}
                  >
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-1 mr-3"
                      onClick={() => {
                        toggleEditEducationForm(education.id);
                        EditHandle();
                      }}
                    >
                      편집
                    </Button>
                    <DeleteButton
                      educationid={education.id}
                      onRemove={onRemove}
                    ></DeleteButton>
                  </Col>
                ) : null}
              </div>
              {isEditing && education.id === targetId && (
                <EducationForm
                  education={{
                    ...education,
                  }}
                  onConfirm={confirmEditEducation}
                  onCancel={cancelEditEducation}
                  byEditbtn={byEditbtn}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EducationCard;
