 import { useState, useEffect } from "react";
 import "./App.css";
 
 const initialStudents = [
   { id: 1, name: "Gokul", email: "gokul@example.com", course: "BCA" },
   { id: 2, name: "Rahul", email: "rahul@example.com", course: "BSc CS" },
 ];
 
 function App() {
   const [studentData, setStudentData] = useState(() => {
     const data = localStorage.getItem("students");
     return data !== null ? JSON.parse(data) : initialStudents;
   });
 
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [course, setCourse] = useState("");
   const [editingStudent, setEditingStudent] = useState(null);
   const [error, setError] = useState("");
 
   useEffect(() => {
     localStorage.setItem("students", JSON.stringify(studentData));
   }, [studentData]);
 
   function clearForm() {
     setName("");
     setEmail("");
     setCourse("");
     setEditingStudent(null);
     setError("");
   }
 
   function validateForm() {
     if (!name.trim() || !email.trim() || !course.trim()) {
       setError("Please fill all fields.");
       return false;
     }
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
       setError("Please enter a valid email address.");
       return false;
     }
     setError("");
     return true;
   }
 
   function addStudents() {
     if (!validateForm()) return;
     const newStudent = {
       id: Date.now(),
       name: name.trim(),
       email: email.trim(),
       course: course.trim(),
     };
     setStudentData((prev) => [...prev, newStudent]);
     clearForm();
   }
 
   function deleteStudent(id) {
     setStudentData((prev) => prev.filter((student) => student.id !== id));
     if (editingStudent?.id === id) clearForm();
   }
 
   function editStudent(student) {
     setEditingStudent(student);
     setName(student.name);
     setEmail(student.email);
     setCourse(student.course);
     setError("");
   }
 
   function updateStudent() {
     if (!validateForm()) return;
     const updatedStudents = studentData.map((student) =>
       student.id === editingStudent.id
         ? {
             ...student,
             name: name.trim(),
             email: email.trim(),
             course: course.trim(),
           }
         : student,
     );
     setStudentData(updatedStudents);
     clearForm();
   }
 
   return (
     <div className="app">
       <h1>Student Application</h1>
 
       <div className="layout">
         <form
           onSubmit={(e) => {
             e.preventDefault();
             editingStudent ? updateStudent() : addStudents();
           }}
         >
           <div>
             <label htmlFor="name">Name</label>
             <input
               type="text"
               id="name"
               value={name}
               placeholder="Enter your name"
               onChange={(e) => setName(e.target.value)}
             />
           </div>
 
           <div>
             <label htmlFor="email">Email</label>
             <input
               type="email"
               id="email"
               value={email}
               placeholder="Enter your email"
               onChange={(e) => setEmail(e.target.value)}
             />
           </div>
 
           <div>
             <label htmlFor="course">Course</label>
             <input
               type="text"
               id="course"
               value={course}
               placeholder="Enter your course"
               onChange={(e) => setCourse(e.target.value)}
             />
           </div>
 
           {error && <p className="error">{error}</p>}
 
           <div className="form-actions">
             <button type="submit" className="btn-primary">
               {editingStudent ? "Update student" : "Add student"}
             </button>
             {editingStudent && (
               <button
                 type="button"
                 className="btn-secondary"
                 onClick={clearForm}
               >
                 Cancel
               </button>
             )}
           </div>
         </form>
 
         <section>
           <div className="list-header">
             <h2>Student list</h2>
             <span className="count">{studentData.length} total</span>
           </div>
 
           {studentData.length === 0 ? (
             <p className="empty">No students yet. Add one using the form.</p>
           ) : (
             <div className="student-list">
               {studentData.map((student) => (
                 <div
                   className={`student-card ${
                     editingStudent?.id === student.id ? "is-editing" : ""
                   }`}
                   key={student.id}
                 >
                   <div className="avatar">
                     {student.name.charAt(0).toUpperCase()}
                   </div>
 
                   <div>
                     <h3>{student.name}</h3>
                     <p>{student.email}</p>
                     <p>{student.course}</p>
                   </div>
 
                   <div className="card-actions">
                     <button
                       type="button"
                       className="btn-secondary"
                       onClick={() => editStudent(student)}
                     >
                       Edit
                     </button>
                     <button
                       type="button"
                       className="btn-danger"
                       onClick={() => deleteStudent(student.id)}
                     >
                       Delete
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </section>
       </div>
     </div>
   );
 }
 
 export default App;
 