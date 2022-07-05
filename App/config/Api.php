<?php
namespace App\Controllers;

// use App\Controllers\BaseController;

use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;


use App\Models\Token_Model;
use App\Models\Cart_Model;
use App\Models\Books_Model;
use App\Models\Order_Model;

/**
 * يستعمل هذا الملف للوصول إلى المعلومات الخاصة بأولياء التلاميذ
 * 
 * @class API
 * @extends BaseController
 */



class Api extends ResourceController {

	protected $format = 'json';


    public function __construct(){

        // if (session()->matricule) {
        //     throw new \CodeIgniter\Exceptions\PageNotFoundException();
        // }
        // استدعاء دالة curl
        helper('curl');

        $this->validation =  \Config\Services::validation();
        $this->tokenModel = new Token_Model();
    }


	public function index(){
		
		// الدخول مباشرة إلى الصفحة
			return $this->respond(['message' => 'لم يتم إدخال الأمر'], 401);
		
	}

    /**
     * دالة تسجيل الدخول
     * 
     * @function login
     * @المدخلات : لا يوجد
     * @المخرجات: JSON يحتوي على نجاح وفشل العملية
    */
    function login() {

        helper('curl');

        $data['state'] = false;
        $data['message'] = 'معلومات خاطئة';

        $tharwaApi = config('Tharwa')->tharwaApi;
        $tharwaHeader = config('Tharwa')->tharwaHeaders;

        $response = array();

        $fields['email'] = $this->request->getPost('email');
        $fields['password'] = $this->request->getPost('password');
        // $fields['g-recaptcha-response'] = $this->request->getPost('g-recaptcha-response');

        $this->validation->setRules([
            'email' => ['label' => 'البريد الالكتروني', 'rules' => 'required|valid_email'],
            'password' => ['label' => 'كلمة السر', 'rules' => 'required|min_length[8]|max_length[16]'],
        ]);

        if ($this->validation->run($fields) !== FALSE) {
            
            $tharwaReply = curlFunction($tharwaApi."thamousseni",$fields,$tharwaHeader);

            if($tharwaReply->status == 200){ // تسجيل دخول ناجح
                
                if($tharwaReply->state == 1){

                    $headers = array(
                        'Authorization: Bearer ' . $tharwaReply->token,
                    );
            
                    $headers = array_merge($headers, $tharwaHeader);

                    $childInfo = curlFunction($tharwaApi . "arach", ['MatriculeParentFk' => $tharwaReply->userID], $headers);

                    foreach($childInfo as $child) : 

                        $childData[$child->info->MatriculeElv]['name']     = $child->info->PrenomArElv . " " .  $child->info->NomArElv;
                        $childData[$child->info->MatriculeElv]['etab']     = $child->etab;
                        $childData[$child->info->MatriculeElv]['numDiv'] = trim($child->numDiv);
                                    
                    endforeach;

                    $insert['token'] = $tharwaReply->token;
                    $insert['parent'] = $tharwaReply->userID;
                    $insert['expires'] = date('Y-m-d H:i:s', $tharwaReply->expiresIn);

                    $this->tokenModel->insert($insert);


                    $data['state'] = true;
                    $data['message'] = 'تم تسجيل الدخول بنجاح';
                    $data['token'] = $tharwaReply->token;
                    $data['matricule'] = $tharwaReply->userID;
                    $data['name'] = $tharwaReply->data->PrenomArParent;
                    $data['familyname'] = $tharwaReply->data->NomArParent;
                    $data['email'] = $tharwaReply->userEmail;
                    $data['childData'] = $childData;

                }

            }
            
        }else{

            $data['message'] = 'يرجى إرسال معلومات الدخول';

        }

        return $this->response->setJSON($data);
    }


    
    /**
     * قائمة الكتب بصيغة JSON
     * 
     * @function booksList
     * @المدخلات : لا يوجد
     * @المخرجات: لا يوجد
    */

    public function booksList() {

        // الدوال المساعدة
        helper('misc');
        helper('asset');

        $where = array();
        $cycle = $this->request->getPost('cycle');
        $division = $this->request->getPost('division');

        if($cycle) $where['cycle'] = $cycle;
        if($division) $where['division'] = $division;


        $booksModel = new Books_Model(); // استدعاء موديل الكتب
        $booksList = $booksModel->where($where)->find();

		return $this->response->setJSON($booksList);	

    }




    /**
     * قائمة المراكز بصيغة JSON
     * 
     * @function centerList
     * @المدخلات : لا يوجد
     * @المخرجات: لا يوجد
    */

    public function centerList() {

        $centerModel = new Center_Model(); // استدعاء موديل المراكز

        $where = array();
        $wil = $this->request->getPost('wil');

        if($wil) $where['wil'] = $wil;


        $centerList = $centerModel->where($where)->find();
       
		return $this->response->setJSON($centerList);	

    }


    /**
     * قائمة المكتبات المعتمدة بصيغة JSON
     * 
     * @function biblioList
     * @المدخلات : لا يوجد
     * @المخرجات: لا يوجد
    */

    public function biblioList() {

        $biblioModel = new Biblio_Model(); // استدعاء موديل المكتبة

        $where = array();
        $wil = $this->request->getPost('wil');

        if($wil) $where['wil'] = $wil;



        $biblioList = $biblioModel->where($where)->find();
       
		return $this->response->setJSON($biblioList);	

    }


    /**
     * دالة تحديث السلة
     * 
     * @function updateCart
     * @المدخلات : لا يوجد
     * @المخرجات: JSON يحتوي على نجاح وفشل العملية
    */

    public function updateCart(){
       
        $books = $this->request->getPost('books');
        $parent = $this->request->getPost('parent');

        $data['state'] = false;
        $data['message'] = 'يرجى إدخال معلومات الطلب';

        if($books && is_array($books)){

            $cartModel = new Cart_Model();

            $cartData = $cartModel->where('parent', $parent)
                            ->first();

            if($cartData){

                $update = array();
                $update['data'] = json_encode($books);
                $cartModel->update($parent, $update);

            }else{

                $insert = array();
                $insert['parent'] = $parent;
                $insert['data'] = json_encode($books);
                $cartModel->insert($insert);

            }

            $data['state'] = true;
            $data['message'] = 'تم تحديث سلة المشتريات';

        }

        return $this->response->setJSON($data);

    }

    /**
     * دالة سلة المشتريات
     * 
     * @function getCart
     * @المدخلات : Token, parent
     * @المخرجات: total, books, totalPrice
    */

    public function getCart(){

        $parent = $this->request->getPost('parent');

        $data['total'] = 0;
        $data['totalPrice'] = 0;
       
        $cartModel = new Cart_Model();
        $booksModel = new Books_Model();


        $cartData = $cartModel->where('parent', $parent)
                            ->first();
        
        if($cartData){

            $cData = json_decode($cartData->data,true);

            foreach($cData as $matricule => $v){

                $books = array_keys($v);
                $data['total'] += count($books);

                foreach($books as $eachBook){

                    $bookData = $booksModel->
                                    where('book_id', str_replace("'", "",$eachBook))->
                                    first();

                    $data['totalPrice'] += $bookData->price;
                    $data[$matricule]['books'][] = $bookData;

                }

            }

        }


        return $this->response->setJSON($data);	

    }


    /**
     * دالة إضافة طلب
     * 
     * @function addOrder
     * @المدخلات : Token, parent, Total
     * @المخرجات: State, Url 
    */
	public function addOrder(){

		$total = $this->request->getPost('total');
		$parent = $this->request->getPost('parent');

		$year = 21;
		
		// Time to avoid duplicated!
		$time = time();
		$rand = $time . random_string('numeric', 4);

		// Generate Order
		$orderNumber = $year . $rand . $this->matricule . $time;

		$orderNumber = "";
		
		$insert = array(
			'order_id' => $orderNumber,
			'parent' => $parent,
			'date' => date('Y-m-d'),
			'price' => $total
		);

		$this->ordersModel->insert($insert);

		helper('curl');

        $returnUrl = base_url("checkPayment/$orderNumber");

        $postOptions = ["amount" => $total,
            // "userName" => $resData['userName'], // معلومات حساب الذهبية
            // "password" => $resData['password'],
            "orderNumber" => $orderNumber,
            "returnUrl" => $returnUrl,
            "currency" => "012",
            "language" => "ar"
        ];
        
        $result = curlFunction('https://webmerchant.poste.dz/payment/rest/register.do',$postOptions);
        
        // save result
        $update['return']  = json_encode($result);
        $update['status']  = $result['status'];
        $this->ordersModel->update($orderNumber,$update);

        if($result['errorCode'] == 0){
            
            $data['state'] = 1;
            $data['message'] = 'تم إضافة طلب الدفع';
            $data['url'] = $result['formUrl'];

        }else{
            
            $data['state'] = 0;
            $data['message'] = 'فشل عملية إضافة طلب الدفع';            
        }

        return $this->response->setJSON($data);

	}

    
    /**
     * دالة التحقق من الطلب
     * 
     * @function checkOrder
     * @المدخلات : Token, orderNb, Parent
     * @المخرجات: State, Url 
    */
	public function checkOrder(){
		
		$parent = $this->request->getPost('parent');
		$orderNb = $this->request->getPost('orderNb');

        $data['state']  = false;
        $data['message'] = 'فشل عملية الدفع';

		if (!$this->validation->check($orderNb, 'required|isValidOrderNb')) {
			throw new \CodeIgniter\Exceptions\PageNotFoundException();
		}

        $result = $this->ordersModel
            ->where(['order_id' => $orderNb, 'parent' => $parent, 'status' => 1])
            ->find();

        if($result){ // عملية ناجحة وموجودة في قاعدة البيانات

            $data['state']  = true;
            $data['message'] = 'تمت عملية الدفع بنجاح!';

        }else{


            $data = [
                'orderId'  => $orderId,
                // 'userName' => $data['userName'], // معلومات حساب الذهبية
                // 'password' => $data['password'],
                'language' => 'ar'
            ];
        
            $respond = curlFunction('https://webmerchant.poste.dz/payment/rest/getOrderStatus.do',$data);
                        
            if($respond['ErrorCode'] == 0 AND $respond['OrderStatus'] == 2){

                $update['return'] = json_encode($respond);
                $update['status'] = 1;
                
                $result = $this->ordersModel
                     ->where(['order_id' => $orderNb, 'parent' => $parent])
                     ->set($update)
                     ->update();


                $data['state']  = true;
                $data['message'] = 'تمت عملية الدفع بنجاح!';
                
            }

        }
		
        return $this->response->setJSON($data);

	}

}
