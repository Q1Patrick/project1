#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
#include <algorithm>

using namespace std;

struct NhanVien {
    string maNV, hoTen, ngaySinh, email, diaChi, sdt;
    int soNgayCong;
    double luongNgay;
    double thucLinh;
};

struct Node {
    NhanVien data;
    Node* next;
};

Node* head = nullptr;

/* ================== HÀM TIỆN ÍCH ================== */
string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}

double tinhThucLinh(NhanVien nv) {
    return nv.soNgayCong * nv.luongNgay;
}

/* ================== TẠO NODE ================== */
Node* createNode(NhanVien nv) {
    Node* p = new Node;
    p->data = nv;
    p->next = nullptr;
    return p;
}

/* ================== THÊM CUỐI ================== */
void addLast(Node*& head, NhanVien nv) {
    Node* p = createNode(nv);
    if (!head) {
        head = p;
        return;
    }
    Node* temp = head;
    while (temp->next) temp = temp->next;
    temp->next = p;
}

/* ================== HIỂN THỊ ================== */
void printNV(NhanVien nv) {
    cout << left << setw(8) << nv.maNV
         << setw(20) << nv.hoTen
         << setw(12) << nv.ngaySinh
         << setw(20) << nv.email1
         << setw(15) << nv.diaChi
         << setw(12) << nv.sdt
         << setw(6) << nv.soNgayCong
         << setw(10) << nv.luongNgay
         << nv.thucLinh << endl;
}

void displayList(Node* head) {
    cout << "\nDANH SACH NHAN VIEN\n";
    for (Node* p = head; p; p = p->next)
        printNV(p->data);
}

/* ================== ĐỌC FILE ================== */
void readFromFile(string filename) {
    ifstream in(filename);
    if (!in) {
        cout << "Khong mo duoc file!\n";
        return;
    }

    head = nullptr;
    while (!in.eof()) {
        NhanVien nv;
        getline(in, nv.maNV, '|');
        if (nv.maNV == "") break;
        getline(in, nv.hoTen, '|');
        getline(in, nv.ngaySinh, '|');
        getline(in, nv.email, '|');
        getline(in, nv.diaChi, '|');
        getline(in, nv.sdt, '|');
        in >> nv.soNgayCong;
        in.ignore();
        in >> nv.luongNgay;
        in.ignore();

        nv.thucLinh = tinhThucLinh(nv);
        addLast(head, nv);
    }
    in.close();
}

/* ================== GHI FILE ================== */
void writeToFile(string filename) {
    ofstream out(filename);
    for (Node* p = head; p; p = p->next) {
        NhanVien nv = p->data;
        out << nv.maNV << "|"
            << nv.hoTen << "|"
            << nv.ngaySinh << "|"
            << nv.email << "|"
            << nv.diaChi << "|"
            << nv.sdt << "|"
            << nv.soNgayCong << "|"
            << nv.luongNgay << endl;
    }
    out.close();
}

/* ================== TÌM KIẾM ================== */
void findByMa(string ma) {
    for (Node* p = head; p; p = p->next)
        if (p->data.maNV == ma) {
            printNV(p->data);
            return;
        }
    cout << "Khong tim thay!\n";
}                                                                                                                                                                                   void findByTen(string ten) {
    ten = toLower(ten);
    for (Node* p = head; p; p = p->next)
        if (toLower(p->data.hoTen).find(ten) != string::npos)
            printNV(p->data);
}

/* ================== SẮP XẾP ================== */
void sortByThucLinh() {
    for (Node* i = head; i; i = i->next)
        for (Node* j = i->next; j; j = j->next)
            if (i->data.thucLinh > j->data.thucLinh)
                swap(i->data, j->data);
}

/* ================== XOÁ ================== */
void deleteByMa(string ma) {
    if (!head) return;
    if (head->data.maNV == ma) {
        Node* t = head;
        head = head->next;
        delete t;
        return;
    }
    Node* p = head;
    while (p->next && p->next->data.maNV != ma)
        p = p->next;
    if (p->next) {
        Node* t = p->next;
        p->next = t->next;
        delete t;
    }
}

/* ================== Thêm Nhân viên ================== */
void addNew(Node*& head) {
    NhanVien nv;
    cout << "Nhap thong tin NV moi:\n";
    do {
        cout << "Ma NV: "; cin >> nv.maNV;
        if (isDuplicate(head, nv.maNV)) cout << "Ma da ton tai!\n";
    } while (isDuplicate(head, nv.maNV));
    cin.ignore();
    cout << "Ho ten: "; getline(cin, nv.hoTen);
    cout << "Ngay sinh: "; cin >> nv.ngaySinh;
    cout << "Email: "; cin >> nv.email;
    cin.ignore();
    cout << "Dia chi: "; getline(cin, nv.diaChi);
    cout << "SDT: "; cin >> nv.sdt;
    cout << "So ngay cong: "; cin >> nv.soNgayCong;
    cout << "Luong ngay: "; cin >> nv.luongNgay;
    nv.tinhLuong();
    append(head, nv);
    saveToFile(head, "DSNV_THEM.txt");
    cout << "Da them va luu vao DSNV_THEM.txt\n";
}

/* ================== MENU ================== */
void menu() {
    int ch;
    do {
        cout << "\n1. Nhap tu ban phim va ghi file"
             << "\n2. Doc file DSNV.txt"
             << "\n3. Tim theo ma"
             << "\n4. Tim theo ten"
             << "\n5. Hien thi danh sach"
             << "\n6. Sap xep theo thuc linh va ghi file"
             << "\n7. Xoa theo ma"
             << "\n8. Them nhan vien moi"
             << "\n9. Sua thong tin theo ma"
             << "\n0. Thoat\nChon: ";
        cin >> ch;
        cin.ignore();

        if (ch == 1) {
            NhanVien nv;
            cout << "Ma NV: "; getline(cin, nv.maNV);
            cout << "Ho ten: "; getline(cin, nv.hoTen);
            cout << "Ngay sinh: "; getline(cin, nv.ngaySinh);
            cout << "Email: "; getline(cin, nv.email);
            cout << "Dia chi: "; getline(cin, nv.diaChi);
            cout << "SDT: "; getline(cin, nv.sdt);
            cout << "So ngay cong: "; cin >> nv.soNgayCong;
            cout << "Luong ngay: "; cin >> nv.luongNgay;
            cin.ignore();

            nv.thucLinh = tinhThucLinh(nv);
            addLast(head, nv);
            writeToFile("DSNV.txt");
        }
        else if (ch == 2) readFromFile("DSNV.txt");
        else if (ch == 3) {
            string ma;
            cout << "Nhap ma: ";
            getline(cin, ma);
            findByMa(ma);
        }
        else if (ch == 4) {
            string ten;
            cout << "Nhap ten: ";
            getline(cin, ten);
            findByTen(ten);
        }
        else if (ch == 5) displayList(head);
        else if (ch == 6) {
            sortByThucLinh();
            writeToFile("DSNV_SAPXEP.txt");
        }
        else if (ch == 7) {
            string ma;
            cout << "Nhap ma can xoa: ";
            getline(cin, ma);
            deleteByMa(ma);
            writeToFile("DSNV_XOA.txt");
        }
        else if (ch == 8) {
            addNew(head);
        }
        else if (ch == 9) {
            string ma;
            cout << "Nhap ma can sua: ";
            getline(cin, ma);
            editByMa(ma);
        }
    } while (ch != 0);
}

int main() {
    menu();
    return 0;
}