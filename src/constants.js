export const DB_NAME = "DevBlog"


export const UserLoginType = {
    GOOGLE: "GOOGLE",
    EMAIL_PASSWORD: "EMAIL_PASSWORD"
}
export const AvailableSocialLogins = Object.values(UserLoginType)



export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
}

export const AvailableUserRoles = Object.values(UserRolesEnum)