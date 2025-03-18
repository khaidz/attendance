let web3;
let contract;
let userAccount;
let contractAddress = "0xB0FC700aD5dE794bA79FC308f8119729E5b5C665"; // Replace with your deployed contract address

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "classId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "studId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAttendanceValue",
        "type": "uint256"
      }
    ],
    "name": "AttendanceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "classId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "teacherAddress",
        "type": "address"
      }
    ],
    "name": "ClassCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "classId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "studId",
        "type": "uint256"
      }
    ],
    "name": "StudentAddedToClass",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "studId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "lName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "age",
        "type": "uint256"
      }
    ],
    "name": "StudentCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "teacherAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "lName",
        "type": "string"
      }
    ],
    "name": "TeacherCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "roles",
    "outputs": [
      {
        "internalType": "enum AttendanceSheet.Role",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserRole",
    "outputs": [
      {
        "internalType": "enum AttendanceSheet.Role",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_teacherAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_fName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lName",
        "type": "string"
      }
    ],
    "name": "addTeacher",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_studId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_age",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_fName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lName",
        "type": "string"
      }
    ],
    "name": "createStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_classId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_teacherAddress",
        "type": "address"
      }
    ],
    "name": "createClass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_classId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_studId",
        "type": "uint256"
      }
    ],
    "name": "addStudentToClass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_classId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_studId",
        "type": "uint256"
      }
    ],
    "name": "markAttendance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_studId",
        "type": "uint256"
      }
    ],
    "name": "getStudent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_classId",
        "type": "uint256"
      }
    ],
    "name": "getClassStudents",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_classId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_studId",
        "type": "uint256"
      }
    ],
    "name": "getStudentAttendance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_teacherAddress",
        "type": "address"
      }
    ],
    "name": "getTeacherClasses",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllClasses",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllStudents",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_classId",
        "type": "uint256"
      }
    ],
    "name": "getClassInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAllTeachers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_teacherAddress",
        "type": "address"
      }
    ],
    "name": "getTeacher",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_studId",
        "type": "uint256"
      }
    ],
    "name": "getStudentClassId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

// Initialize Web3 and Contract
async function init() {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Initialize Web3
      web3 = new Web3(window.ethereum);

      // Initialize contract
      contract = new web3.eth.Contract(contractABI, contractAddress);

      // Check contract deployment
      const code = await web3.eth.getCode(contractAddress);
      if (code === "0x" || code === "") {
        throw new Error("Contract not deployed at this address");
      }

      // Hide all panels initially
      document.getElementById("adminPanel").style.display = "none";
      document.getElementById("teacherPanel").style.display = "none";
      document.getElementById("studentPanel").style.display = "block";

      // Show connect wallet button and hide disconnect button
      document.getElementById("connectWallet").style.display = "block";
      document.getElementById("disconnectWallet").style.display = "none";
      document.getElementById("userRole").textContent = "";
    } catch (error) {
      console.error("Initialization error:", error);
      alert("Error initializing application: " + error.message);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

// Add new connect wallet function
async function connectWallet() {
  try {
    // Initialize Web3 first
    web3 = new Web3(window.ethereum);

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Get user account
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];

    // Initialize contract
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Update UI
    document.getElementById("connectWallet").style.display = "none";
    document.getElementById("disconnectWallet").style.display = "block";
    document.getElementById("userRole").textContent =
      "Connected: " + userAccount.slice(0, 6) + "..." + userAccount.slice(-4);

    // Check role
    await checkRole();
  } catch (error) {
    console.error("Error connecting wallet:", error);
    alert("Error connecting wallet: " + error.message);
  }
}

// Add disconnect wallet function
async function disconnectWallet() {
  try {
    // Reset variables
    userAccount = null;
    web3 = null;
    contract = null;

    // Hide all panels
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("teacherPanel").style.display = "none";
    document.getElementById("studentPanel").style.display = "block";

    // Reset UI
    document.getElementById("connectWallet").style.display = "block";
    document.getElementById("disconnectWallet").style.display = "none";
    document.getElementById("userRole").textContent = "";

    // Clear any existing data
    document.getElementById("teachersList").innerHTML = "";
    document.getElementById("studentsList").innerHTML = "";
    document.getElementById("classesList").innerHTML = "";
    document.getElementById("classStudentsList").innerHTML = "";
    document.getElementById("studentAttendanceInfo").innerHTML = "";
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    alert("Error disconnecting wallet: " + error.message);
  }
}

// Check user role and show appropriate panel
async function checkRole() {
  try {
    if (!contract || !userAccount) {
      throw new Error("Contract or user account not initialized");
    }

    console.log("Checking role for account:", userAccount);
    const userRole = await contract.methods.getUserRole(userAccount).call();
    console.log("User role:", userRole);

    // Hide all panels first
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("teacherPanel").style.display = "none";
    document.getElementById("studentPanel").style.display = "block";

    // Show appropriate panel based on role
    switch (userRole) {
      case "0": // None
        document.getElementById("userRole").textContent = "No Role";
        document.getElementById("studentPanel").style.display = "block";
        break;
      case "1": // Admin
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("userRole").textContent = "Admin";
        document.getElementById("studentPanel").style.display = "none";
        await loadAdminData();
        break;
      case "2": // Teacher
        document.getElementById("teacherPanel").style.display = "block";
        document.getElementById("userRole").textContent = "Teacher";
        document.getElementById("studentPanel").style.display = "none";
        await loadTeacherData();
        break;
      case "3": // Student
        document.getElementById("studentPanel").style.display = "block";
        document.getElementById("userRole").textContent = "Student";
        document.getElementById("studentPanel").style.display = "block";
        break;
      default:
        document.getElementById("userRole").textContent = "Unknown Role";
        document.getElementById("studentPanel").style.display = "block";
    }
  } catch (error) {
    console.error("Error checking role:", error);
    document.getElementById("userRole").textContent = "Error: " + error.message;
  }
}

// Admin Functions
async function loadAdminData() {
  try {
    if (!contract || !userAccount) {
      throw new Error("Contract or user account not initialized");
    }

    // Check if user is admin first
    const userRole = await contract.methods.getUserRole(userAccount).call();
    if (userRole !== "1") {
      // 1 is Admin role
      throw new Error("You don't have permission to view this data");
    }

    await loadTeachers();
    await loadStudents();
    await loadClasses();
  } catch (error) {
    console.error("Error loading admin data:", error);
    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

async function addTeacher() {
  const address = document.getElementById("teacherAddress").value;
  const firstName = document.getElementById("teacherFirstName").value;
  const lastName = document.getElementById("teacherLastName").value;

  try {
    await contract.methods
      .addTeacher(address, firstName, lastName)
      .send({ from: userAccount });
    alert("Teacher added successfully!");
    document.getElementById("teacherAddress").value = "";
    document.getElementById("teacherFirstName").value = "";
    document.getElementById("teacherLastName").value = "";
    loadTeachers();
  } catch (error) {
    console.error("Error adding teacher:", error);
    alert("Error adding teacher");
  }
}

async function addStudent() {
  const id = document.getElementById("studentId").value;
  const age = document.getElementById("studentAge").value;
  const firstName = document.getElementById("studentFirstName").value;
  const lastName = document.getElementById("studentLastName").value;

  try {
    await contract.methods
      .createStudent(id, age, firstName, lastName)
      .send({ from: userAccount });
    alert("Student added successfully!");
    document.getElementById("studentId").value = "";
    document.getElementById("studentAge").value = "";
    document.getElementById("studentFirstName").value = "";
    document.getElementById("studentLastName").value = "";
    loadStudents();
  } catch (error) {
    console.error("Error adding student:", error);
    alert("Error adding student");
  }
}

async function addClass() {
  const id = document.getElementById("classId").value;
  const name = document.getElementById("className").value;
  const teacherAddress = document.getElementById("teacherSelect").value;

  try {
    await contract.methods
      .createClass(id, name, teacherAddress)
      .send({ from: userAccount });
    alert("Class added successfully!");
    document.getElementById("classId").value = "";
    document.getElementById("className").value = "";
    document.getElementById("teacherSelect").value = "";
    loadClasses();
  } catch (error) {
    console.error("Error adding class:", error);
    alert("Error adding class");
  }
}

async function addStudentToClass() {
  const classId = document.getElementById("classSelect").value;
  const studentId = document.getElementById("studentSelect").value;

  try {
    await contract.methods
      .addStudentToClass(classId, studentId)
      .send({ from: userAccount });
    alert("Student added to class successfully!");
    document.getElementById("classSelect").value = "";
    document.getElementById("studentSelect").value = "";
    loadClasses();
  } catch (error) {
    console.error("Error adding student to class:", error);
    alert("Error adding student to class");
  }
}

// Teacher Functions
async function loadTeacherData() {
  try {
    const classes = await contract.methods
      .getTeacherClasses(userAccount)
      .call();
    const select = document.getElementById("teacherClassSelect");
    select.innerHTML = '<option value="">Select Class</option>';

    for (const classId of classes) {
      var classInfo = await contract.methods .getClassInfo(classId)
      .call();
      var name = classInfo[0];
      var teacherAddress = classInfo[1];
      var studentIds = classInfo[2];
      // const [name, teacherAddress, studentIds] = await contract.methods
      //   .getClassInfo(classId)
      //   .call();
      select.innerHTML += `<option value="${classId}">${name}</option>`;
    }
  } catch (error) {
    console.error("Error loading teacher data:", error);
  }
}

async function loadClassStudents() {
  const classId = document.getElementById("teacherClassSelect").value;
  if (!classId) return;

  try {
      const studentIds = await contract.methods.getClassStudents(classId).call();
      const list = document.getElementById("classStudentsList");
      list.innerHTML = `
          <h6>Class Students</h6>
          <div class="row header">
              <div class="col">ID</div>
              <div class="col">Name</div>
              <div class="col">Age</div>
              <div class="col">Attendance Status</div>
              <div class="col">Action</div>
          </div>
      `;

      for (const studentId of studentIds) {
          var studentInfo = await contract.methods.getStudent(studentId).call();
          var firstName = studentInfo[0];
          var lastName = studentInfo[1];
          var age = studentInfo[2];
          var attendanceValue = await contract.methods.getStudentAttendance(classId, studentId).call();

          list.innerHTML += `
              <div class="row">
                  <div class="col">${studentId}</div>
                  <div class="col">${firstName} ${lastName}</div>
                  <div class="col">${age}</div>
                  <div class="col">${attendanceValue > 0 ? "Marked" : "Not Marked"}</div>
                  <div class="col">
                      ${attendanceValue > 0 ? "" : `<button class="btn btn-sm btn-success" onclick="markAttendance('${classId}', '${studentId}')">Mark Attendance</button>`}
                  </div>
              </div>
          `;
      }
  } catch (error) {
      console.error("Error loading class students:", error);
  }
}

async function markAttendance(classId, studentId) {
  try {
    await contract.methods
      .markAttendance(classId, studentId)
      .send({ from: userAccount });
    alert("Attendance marked successfully!");
    loadClassStudents();
  } catch (error) {
    console.error("Error marking attendance:", error);
    alert("Error marking attendance");
  }
}

// Student Functions
async function searchStudent() {
  const studentId = document.getElementById("studentSearchId").value;
  if (!studentId) return;

  try {
    const defaultAccount = "0xD38Fbb7103b1d5dfC03987bb3Db4BA59aaA46770"; // Thay thế bằng địa chỉ hợp lệ
    if (!contract) {
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(contractABI, contractAddress);
    }

    // Lấy thông tin sinh viên
    var studentInfo = await contract.methods.getStudent(studentId).call({ from: defaultAccount });
    console.log(studentInfo);
    var firstName = studentInfo[0];
    var lastName = studentInfo[1];
    var age = studentInfo[2];
    var attendance = studentInfo[3];

    // Lấy danh sách lớp mà sinh viên đã tham gia
    var classIds = studentInfo[4]; // Cần cập nhật hàm getStudent để trả về classIds
    let classDetails = "";

    for (let i = 0; i < classIds?.length; i++) {
      const classId = classIds[i];
      const attendanceValue = await contract.methods.getStudentAttendance(classId, studentId).call();
      classDetails += `<p>Class ID: ${classId}, Attendance: ${attendanceValue}</p>`;
    }

    const info = document.getElementById("studentAttendanceInfo");
    info.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h6>Student Information</h6>
          <p>Name: ${firstName} ${lastName}</p>
          <p>Age: ${age}</p>
          <p>Total Attendance: ${attendance}</p>
          <h6>Classes:</h6>
          ${classDetails}
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error searching student:", error);
    alert("Error searching student");
  }
}

// Helper Functions
async function loadTeachers() {
  try {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    // Check if user is admin
    const userRole = await contract.methods.getUserRole(userAccount).call();
    if (userRole !== "1") {
      throw new Error("You don't have permission to view teachers list");
    }

    const teacherAddresses = await contract.methods.getAllTeachers().call();
    const teacherSelect = document.getElementById("teacherSelect");
    teacherSelect.innerHTML = '<option value="">Select a teacher</option>';

    if (teacherAddresses.length === 0) {
      teacherSelect.innerHTML +=
        '<option value="" disabled>No teachers available</option>';
      return;
    }

    for (const address of teacherAddresses) {
      try {
        var teacherInfo = await contract.methods.getTeacher(address).call();
        var fName = teacherInfo[0];
        var lName = teacherInfo[1];
        // const [fName, lName] = await contract.methods
        //   .getTeacher(address)
        //   .call();
        const option = document.createElement("option");
        option.value = address;
        option.textContent = `${fName} ${lName}`;
        teacherSelect.appendChild(option);
      } catch (error) {
        console.error(`Error loading teacher ${address}:`, error);
        const option = document.createElement("option");
        option.value = address;
        option.textContent = `Unknown Teacher (${address.slice(0, 6)}...)`;
        teacherSelect.appendChild(option);
      }
    }
  } catch (error) {
    console.error("Error loading teachers:", error);
    const teacherSelect = document.getElementById("teacherSelect");
    teacherSelect.innerHTML =
      '<option value="" disabled>Error loading teachers</option>';
  }
}

async function loadStudents() {
  try {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    const students = await contract.methods.getAllStudents().call();
    const list = document.getElementById("studentsList");
    const studentSelect = document.getElementById("studentSelect"); // Dropdown cho sinh viên

    if (students.length === 0) {
      list.innerHTML = "<p>No students available</p>";
      studentSelect.innerHTML = '<option value="">No students available</option>'; // Cập nhật dropdown
      return;
    }

    // Khởi tạo bảng
    list.innerHTML =`
      <h6>All Students</h6>
      <div class="row header">
        <div class="col">ID</div>
        <div class="col">Name</div>
        <div class="col">Age</div>
        <div class="col">Attendance</div>
      </div>
    `
      // '<h6>All Students</h6><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Attendance</th></tr></thead><tbody>';

    studentSelect.innerHTML = '<option value="">Select a student</option>'; // Khởi tạo dropdown

    for (const studentId of students) {
      try {
        var studentInfo = await contract.methods.getStudent(studentId).call();
        var firstName = studentInfo[0];
        var lastName = studentInfo[1];
        var age = studentInfo[2];
        var attendance = studentInfo[3];

        // Thêm dữ liệu vào bảng
        list.innerHTML += `
          <div class="row">
            <div class="col">${studentId}</div>
            <div class="col">${firstName} ${lastName}</div>
            <div class="col">${age}</div>
            <div class="col">${attendance}</div>
          </div>
        `;

        // Thêm vào dropdown
        studentSelect.innerHTML += `<option value="${studentId}">${firstName} ${lastName}</option>`;
      } catch (error) {
        console.error(`Error loading student ${studentId}:`, error);
        list.innerHTML += `
          <div class="row">
            <div class="col">${studentId}</div>
            <div class="col" colspan="3">Error loading student details</div>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error("Error loading students:", error);
    const list = document.getElementById("studentsList");
    list.innerHTML = "<p>Error loading students. Please try again.</p>";
  }
}

async function loadClasses() {
  try {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    // Check if user is admin
    const userRole = await contract.methods.getUserRole(userAccount).call();
    if (userRole !== "1") {
      throw new Error("You don't have permission to view classes list");
    }

    const classes = await contract.methods.getAllClasses().call();
    const list = document.getElementById("classesList");
    const classSelect = document.getElementById("classSelect"); // Dropdown cho lớp

    if (classes.length === 0) {
      list.innerHTML = "<p>No classes available</p>";
      classSelect.innerHTML = '<option value="">No classes available</option>'; // Cập nhật dropdown
      return;
    }

    list.innerHTML =`
      <h6>All Classes</h6>
      <div class="row header">
        <div class="col">ID</div>
        <div class="col">Name</div>
        <div class="col">Teacher</div>
        <div class="col">Students</div>
      </div>
    `
      // '<h6>All Classes</h6><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Teacher</th><th>Students</th></tr></thead><tbody>';

    classSelect.innerHTML = '<option value="">Select a class</option>'; // Khởi tạo dropdown

    for (const classId of classes) {
      try {
        var classInfo = await contract.methods.getClassInfo(classId).call();
        var name = classInfo[0];
        var teacherAddress = classInfo[1];
        var studentIds = classInfo[2];

        // Get teacher name
        let teacherName = "Unknown";
        try {
          var teacherInfo = await contract.methods.getTeacher(teacherAddress).call();
          var fName = teacherInfo[0];
          var lName = teacherInfo[1];
          teacherName = `${fName} ${lName}`;
        } catch (error) {
          console.error(`Error getting teacher info for ${teacherAddress}:`, error);
          teacherName = `Unknown Teacher (${teacherAddress.slice(0, 6)}...)`;
        }

        // Get student details
        let studentList = "";
        if (studentIds && studentIds.length > 0) {
          for (const studentId of studentIds) {
            try {
              var studentInfo = await contract.methods.getStudent(studentId).call();
              var fName = studentInfo[0];
              var lName = studentInfo[1];
              studentList += `<div>${fName} ${lName}</div>`;
            } catch (error) {
              console.error(`Error getting student info for ${studentId}:`, error);
              studentList += `<div>Unknown Student (${studentId})</div>`;
            }
          }
        } else {
          studentList = "No students";
        }

        list.innerHTML += `
          <div class="row">
            <div class="col">${classId}</div>
            <div class="col">${name}</div>
            <div class="col">${teacherName}</div>
            <div class="col">
              <div class="student-list">
                ${studentList}
              </div>
            </div>
          </div>
        `;

        // Thêm vào dropdown
        classSelect.innerHTML += `<option value="${classId}">${name}</option>`;
      } catch (error) {
        console.error(`Error loading class ${classId}:`, error);
        list.innerHTML += `
          <div class="row">
            <div class="col">${classId}</div>
            <div class="col" colspan="3">Error loading class details</div>
          </div>
        `;
      }
    }
    list.innerHTML += "</tbody></table>";
  } catch (error) {
    console.error("Error loading classes:", error);
    const list = document.getElementById("classesList");
    list.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

// Initialize when the page loads
window.addEventListener("load", init);
