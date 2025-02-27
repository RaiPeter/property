const rolesPermissions = require("../config/rolesPermissions");

const verifyRolesAndPermissions = (allowedRoles, requiredPermission) => {
    return (req, res, next) => {
        try {
            const user = req.user; // Assume `req.user` is set by `verifyJWT`
            console.log("pertmission", user);
            
            if (!user || !user.role) {
                return res.status(403).json({ message: "Access denied. No role assigned." });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "Access denied. Role not permitted." });
            }

            const userPermissions = rolesPermissions[user.role];

            if (!userPermissions?.includes(requiredPermission)) {
                return res.status(403).json({ message: "Access denied. Insufficient permissions." });
            }

            next(); // User is authorized
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
};

module.exports = verifyRolesAndPermissions;