// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
}

contract AttendanceSheet is Owned {
    enum Role { None, Admin, Teacher, Student }

    struct Student {
        uint256 age;
        string fName;
        string lName;
        uint256 attendanceValue;
        address studentAddress;
        uint256[] classIds;
    }

    struct Teacher {
        string fName;
        string lName;
        uint256[] classIds; // Danh sách các lớp mà giáo viên phụ trách
    }

    struct Class {
        string name;
        address teacherAddress;
        uint256[] studentIds;
    }

    // Mappings
    mapping(address => Role) public roles;
    mapping(uint256 => Student) private studentList;
    mapping(address => Teacher) private teacherList;
    mapping(uint256 => Class) private classList;
    mapping(uint256 => mapping(uint256 => uint256)) private attendanceRecords; // classId => studentId => attendanceValue
    
    // Arrays
    uint256[] private studIdList;
    uint256[] private classIdList;
    address[] private teacherAddresses; // Rename to avoid confusion

    // Events
    event StudentCreated(uint256 indexed studId, string fName, string lName, uint256 age);
    event TeacherCreated(address indexed teacherAddress, string fName, string lName);
    event ClassCreated(uint256 indexed classId, string name, address teacherAddress);
    event StudentAddedToClass(uint256 indexed classId, uint256 indexed studId);
    event AttendanceUpdated(uint256 indexed classId, uint256 indexed studId, uint256 newAttendanceValue);

    constructor() {
        roles[msg.sender] = Role.Admin;
    }

    // Add this function to check roles
    function getUserRole(address _user) public view returns (Role) {
        return roles[_user];
    }

    // Modifiers
    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Not authorized: Admin only");
        _;
    }

    modifier onlyTeacher() {
        require(roles[msg.sender] == Role.Teacher, "Not authorized: Teacher only");
        _;
    }

    modifier onlyTeacherOfClass(uint256 _classId) {
        require(classList[_classId].teacherAddress == msg.sender, "Not authorized: Not the teacher of this class");
        _;
    }

    // Admin functions
    function addTeacher(address _teacherAddress, string memory _fName, string memory _lName) public onlyAdmin {
        require(roles[_teacherAddress] == Role.None, "Address already has a role");
        roles[_teacherAddress] = Role.Teacher;
        teacherList[_teacherAddress] = Teacher(_fName, _lName, new uint256[](0));
        teacherAddresses.push(_teacherAddress);
        emit TeacherCreated(_teacherAddress, _fName, _lName);
    }

    function createStudent(uint256 _studId, uint256 _age, string memory _fName, string memory _lName) public onlyAdmin {
        require(_studId > 0, "Invalid student ID");
        require(_age > 0, "Invalid age");
        require(bytes(_fName).length > 0, "First name cannot be empty");
        require(bytes(_lName).length > 0, "Last name cannot be empty");
        require(studentList[_studId].age == 0, "Student already exists");

        studentList[_studId] = Student(_age, _fName, _lName, 0, address(0), new uint256[](0));
        studIdList.push(_studId);
        emit StudentCreated(_studId, _fName, _lName, _age);
    }

    function createClass(uint256 _classId, string memory _name, address _teacherAddress) public onlyAdmin {
        require(_classId > 0, "Invalid class ID");
        require(bytes(_name).length > 0, "Class name cannot be empty");
        require(roles[_teacherAddress] == Role.Teacher, "Invalid teacher address");
        require(classList[_classId].teacherAddress == address(0), "Class already exists");

        classList[_classId] = Class(_name, _teacherAddress, new uint256[](0));
        classIdList.push(_classId);
        teacherList[_teacherAddress].classIds.push(_classId);
        emit ClassCreated(_classId, _name, _teacherAddress);
    }

    function addStudentToClass(uint256 _classId, uint256 _studId) public onlyAdmin {
        require(classList[_classId].teacherAddress != address(0), "Class does not exist");
        require(studentList[_studId].age != 0, "Student does not exist");

        // Kiểm tra xem sinh viên đã thuộc lớp này chưa
        for (uint256 i = 0; i < studentList[_studId].classIds.length; i++) {
            require(studentList[_studId].classIds[i] != _classId, "Student already in this class");
        }

        // Thêm mã lớp vào mảng classIds của sinh viên
        studentList[_studId].classIds.push(_classId);
        
        // Thêm sinh viên vào danh sách sinh viên của lớp
        classList[_classId].studentIds.push(_studId);
        
        emit StudentAddedToClass(_classId, _studId);
    }

    // Teacher functions
    function markAttendance(uint256 _classId, uint256 _studId) public onlyTeacher onlyTeacherOfClass(_classId) {
        // Kiểm tra xem sinh viên có thuộc lớp này không
        bool isInClass = false;
        for (uint256 i = 0; i < studentList[_studId].classIds.length; i++) {
            if (studentList[_studId].classIds[i] == _classId) {
                isInClass = true;
                break;
            }
        }
        require(isInClass, "Student not in this class");

        // Kiểm tra xem sinh viên đã được điểm danh trong lớp này chưa
        require(attendanceRecords[_classId][_studId] == 0, "Attendance already marked for this class");

        attendanceRecords[_classId][_studId] = 1; // Đánh dấu đã điểm danh
        studentList[_studId].attendanceValue += 1; // Tăng tổng số điểm danh

        emit AttendanceUpdated(_classId, _studId, studentList[_studId].attendanceValue);
    }

    // View functions
    function getStudent(uint256 _studId) public view returns (string memory, string memory, uint256, uint256, uint256[] memory) {
        require(studentList[_studId].age != 0, "Student does not exist");
        Student memory s = studentList[_studId];
        return (s.fName, s.lName, s.age, s.attendanceValue, s.classIds);
    }

    function getClassStudents(uint256 _classId) public view returns (uint256[] memory) {
        require(classList[_classId].teacherAddress != address(0), "Class does not exist");
        return classList[_classId].studentIds;
    }

    function getStudentAttendance(uint256 _classId, uint256 _studId) public view returns (uint256) {
        return attendanceRecords[_classId][_studId];
    }

    function getTeacherClasses(address _teacherAddress) public view returns (uint256[] memory) {
        require(roles[_teacherAddress] == Role.Teacher, "Not a teacher");
        return teacherList[_teacherAddress].classIds;
    }

    function getAllClasses() public view returns (uint256[] memory) {
        return classIdList;
    }

    function getAllStudents() public view returns (uint256[] memory) {
        return studIdList;
    }

    function getClassInfo(uint256 _classId) public view returns (string memory, address, uint256[] memory) {
        require(classList[_classId].teacherAddress != address(0), "Class does not exist");
        Class memory c = classList[_classId];
        return (c.name, c.teacherAddress, c.studentIds);
    }

    function getAllTeachers() public view returns (address[] memory) {
        return teacherAddresses;
    }

    function getTeacher(address _teacherAddress) public view returns (string memory, string memory) {
        require(roles[_teacherAddress] == Role.Teacher, "Not a teacher");
        Teacher memory t = teacherList[_teacherAddress];
        return (t.fName, t.lName);
    }

    function getStudentClassId(uint256 _studId) public view returns (uint256) {
        require(studentList[_studId].age != 0, "Student does not exist");
        
        // Lặp qua mảng classIds để tìm mã lớp
        if (studentList[_studId].classIds.length > 0) {
            return studentList[_studId].classIds[0]; // Trả về mã lớp đầu tiên (hoặc có thể thay đổi theo yêu cầu)
        }
        
        return 0; // Nếu sinh viên không thuộc lớp nào, trả về 0
    }
}

