import { body, param } from "express-validator";
import { AvailableUserRoles } from "../constants.js";


const userAssignRoleValidator = () =>{
    return [
        body("role")
        .optional()
        .isIn(AvailableUserRoles)
        .withMessage("Invalid user Role")
    ]
}

export {
    userAssignRoleValidator
}