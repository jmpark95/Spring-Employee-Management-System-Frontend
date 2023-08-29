import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { calculateLeaveBalance, calculateTotalWorkingHoursBetweenStartDateAndEndDate, isWeekday } from "../api/utils";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { LeaveService } from "../api/LeaveService";
import { useNavigate } from "react-router-dom";

export default function SubmitLeaveDialog({ user }) {
   const navigate = useNavigate();
   const [open, setOpen] = useState(false);
   const [startDate, setStartDate] = useState();
   const [endDate, setEndDate] = useState();
   const [totalHours, setTotalHours] = useState();

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setStartDate(null);
      setEndDate(null);
      setOpen(false);
   };

   const isSubmitDisabled = () => {
      if (
         startDate == null ||
         endDate == null ||
         totalHours > calculateLeaveBalance(user?.startDate) - user?.leaveTaken ||
         totalHours < 0 ||
         startDate > endDate
      ) {
         return true;
      }
      return false;
   };

   const handleSubmit = async () => {
      try {
         await LeaveService.createLeaveRequest({
            employeeID: sessionStorage.getItem("id"),
            startDate,
            endDate,
            totalHours,
         });
         navigate(0);
         setStartDate(null);
         setEndDate(null);
         setOpen(false);
      } catch {
         alert("errror");
      }
   };

   useEffect(() => {
      const totalHours = calculateTotalWorkingHoursBetweenStartDateAndEndDate(startDate, endDate);

      setTotalHours(totalHours.toFixed(1));
   }, [startDate, endDate]);

   return (
      <>
         <Button variant="outlined" onClick={handleClickOpen}>
            Request Leave
         </Button>
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
               Current Leave Balance: {calculateLeaveBalance(user?.startDate) - user?.leaveTaken} hours
            </DialogTitle>
            <DialogContent>
               <div>From</div>
               <DatePicker
                  showTimeSelect
                  minTime={new Date(0, 0, 0, 9, 0)}
                  maxTime={new Date(0, 0, 0, 17, 30)}
                  selected={startDate}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  inline
                  filterDate={isWeekday}
                  excludeTimes={[setHours(setMinutes(new Date(), 0), 13)]}
                  onChange={(date) => setStartDate(date)}
               />

               <div>To</div>
               <DatePicker
                  showTimeSelect
                  minTime={new Date(0, 0, 0, 9, 0)}
                  maxTime={new Date(0, 0, 0, 17, 30)}
                  selected={endDate}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  inline
                  excludeTimes={[setHours(setMinutes(new Date(), 0), 13)]}
                  filterDate={isWeekday}
                  onChange={(date) => setEndDate(date)}
               />

               <div>Total hours: {totalHours && totalHours > 0 && startDate < endDate ? totalHours : null}</div>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button disabled={isSubmitDisabled()} onClick={handleSubmit}>
                  Submit
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
}

// const formik = useFormik({
//     initialValues: {
//        employeeId: sessionStorage.getItem("id"),
//        startDate: "",
//        endDate: "",
//     },
//     validationSchema: Yup.object({}),
//     onSubmit: async (values, { resetForm }) => {
//        await EmployeeService.createEmployee(values);
//        navigate(0);
//        resetForm();
//        handleClose();
//     },
//  });

// <TextField
//                   InputLabelProps={{ shrink: true }}
//                   variant="outlined"
//                   label="Start date"
//                   type="datetime-local"
//                   name="startDate"
//                   value={formik.values.startDate}
//                   onChange={formik.handleChange}
//                />
//                {formik.errors.startDate ? <p>{formik.errors.startDate}</p> : null}

//                <TextField
//                   InputLabelProps={{ shrink: true }}
//                   variant="outlined"
//                   label="End date"
//                   type="datetime-local"
//                   name="endDate"
//                   //   inputProps={{
//                   //      max: calculateLeaveMaxDate(
//                   //         formik.values.startDate,
//                   //         calculateLeaveBalance(user?.startDate) - user?.leaveTaken
//                   //      ),
//                   //   }}
//                   value={formik.values.endDate}
//                   onChange={formik.handleChange}
//                />
//                {formik.errors.endDate ? <p>{formik.errors.endDate}</p> : null}
