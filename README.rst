Pineapple 🍍
==============
An online forum website implemented as a MERN stack using tailwind.css for styling. Inspired in part by `Reddit <https://www.reddit.com/>`_.

👥 Team Members
----------------
.. list-table::
   :header-rows: 1

   * - Name
     - ID
   * - `Maximus Lee <https://github.com/maximus-lee-678>`_
     - 2100724
   * - `Aloysius Woo <https://github.com/AloysiusWooRY>`_
     - 2100891
   * - `Jin Zhenglong <https://github.com/jzlong99>`_
     - 2101002
   * - `Chew Wei Jie <https://github.com/chewweije>`_
     - 2101186
   * - `Dylan Teo <https://github.com/dylantjl>`_
     - 2101920
   * - `Tan Jia Ding <https://github.com/jiaric>`_
     - 2102238
   * - `Yap Jia Hao <https://github.com/YapJiaHao>`_
     - 2100958

🔐 Security Features
--------------------
.. list-table::
   :header-rows: 1

   * - Backend
     - Frontend
   * - Email and Password Authentication
     - Masking of Sensitive Information
   * - OTP Configuration & Validation
     - User Input Sanitisation and Validation
   * - Hashing and Encryption of Important Data
     - Automatic Idle Timeout
   * - Anti-CSRF Token
     - Redirect User
   * - JSON Web Tokens
     - Google reCAPTCHA
   * - Session IDs
     - 
   * - Action Rate Limit
     - 
   * - Google reCAPTCHA
     - 
   * - Cross-Origin Resource Sharing (CORS)
     - 
   * - Error Handling
     - 
   * - Logging
     - 
   * - Referential Integrity
     - 

🖥️ Quick Start
---------------

Download and install `Node JS <https://nodejs.org/en/>`_.

* **Local (Windows)**
1. To initialise backend and frontend packages, run:

.. code-block:: console

  setup_update.bat

2. To launch both servers, run:

.. code-block:: console

  start.bat

|

* **Local (Linux)**
1. Install **tmux**.

.. code-block:: bash

  sudo apt-get update 
  sudo apt-get install tmux

2. To initialise backend and frontend packages, run:

.. code-block:: console

  ./setup.sh

3. To launch both servers, run:

.. code-block:: console

  ./start.sh

|

* **Production Server (Linux)**
1. Install **tmux**.

.. code-block:: bash

  sudo apt-get update 
  sudo apt-get install tmux

2. To initialise packages and build the production build, run:

.. code-block:: console

  ./setup_deploy.sh

3. To launch both servers, run:

.. code-block:: console

  ./start_deploy.sh
