import Unit from "../models/unit.model.js";
import ErrorHandler from "../utils/ErrorHandler.util.js";

/**
*   @desc   Create new Unit
*   @route  POST /api/v1/units
*   @access Private/Admin
*/
export const createUnit = async (req,res) => {
   
    const {name} = req.body;
    
    //unit exists
    const unitFound = await Unit.findOne({name: name.toLowerCase()});
    if(unitFound){
        throw new ErrorHandler("Unit already exists", 409);
    }

    //create
    const unit = await Unit.create({
      name,
    });

    return res.status(201).json({
        success: true,
        message: "Unit created successfully",
        unit
    })
}

/**
*   @desc   Get all Units
*   @route  GET /api/v1/units
*   @access Public
*/
export const getUnits = async (req,res) => {
    const units = await Unit.find()
    
    return res.status(200).json({
        success: true,
        message: "Units fetched successfully",
        units
    })
}

/**
*   @desc   Get Single Units
*   @route  GET /api/v1/units/:id
*   @access Public
*/

export const getUnit = async (req,res) => {
    const {id} = req.params;
  
    const unit = await Unit.findById(id)
    if (!unit) {
      throw new ErrorHandler("Unit not found", 404);
    }

    return res.status(200).json({
        success: true,
        message: "Unit fetched successfully",
        unit
    })
}

/**
 * @desc Update Unit
 * @route PUT /api/v1/units/:id/update
 * @access Private/Admin
*/
export const updateUnit = async (req, res) => {
    const { name } = req.body;

    const id = req.params.id;
    const unit = await Unit.findById(id);

    if(!unit){
      throw new ErrorHandler("Unit not found", 404);
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      id,
      {
        name,
      },
      {
        new: true,
      }
    );
    
    

   
   return res.status(200).json({
        success: true,
        message: "Unit updated successfully",
        unit: updatedUnit,
    })
}


/**
 * @desc Delete unit
 * @route DELETE /api/v1/units/:id/delete
 * @access Private/Admin
*/
export const deleteUnit = async (req, res) => {
    const id = req.params.id;

    const unit = await Unit.findByIdAndDelete(id);

    if (!unit) {
      throw new ErrorHandler("Unit not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
      unit,
    });
}